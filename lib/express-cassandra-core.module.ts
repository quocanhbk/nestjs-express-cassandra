import {
  DynamicModule,
  Global,
  Inject,
  Logger,
  Module,
  OnModuleDestroy,
  Provider,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { defer } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  EXPRESS_CASSANDRA_MODULE_ID,
  EXPRESS_CASSANDRA_MODULE_OPTIONS,
} from './express-cassandra.constant';
import {
  ExpressCassandraModuleAsyncOptions,
  ExpressCassandraModuleOptions,
  ExpressCassandraOptionsFactory,
} from './interfaces';
import { Connection, ConnectionOptions } from './orm';
import {
  generateString,
  getConnectionToken,
  handleRetry,
  reduceUdts,
} from './utils/cassandra-orm.utils';

@Global()
@Module({})
export class ExpressCassandraCoreModule implements OnModuleDestroy {
  constructor(
    @Inject(EXPRESS_CASSANDRA_MODULE_OPTIONS)
    private readonly options: ExpressCassandraModuleOptions,
    private readonly moduleRef: ModuleRef,
  ) {}

  static forRoot(options: ExpressCassandraModuleOptions = {}): DynamicModule {
    const expressModuleOptions = {
      provide: EXPRESS_CASSANDRA_MODULE_OPTIONS,
      useValue: options,
    };
    const connectionProvider = {
      provide: getConnectionToken(options as ConnectionOptions),
      useFactory: async () => await this.createConnectionFactory(options),
    };
    return {
      module: ExpressCassandraCoreModule,
      providers: [expressModuleOptions, connectionProvider],
      exports: [connectionProvider],
    };
  }

  static forRootAsync(
    options: ExpressCassandraModuleAsyncOptions,
  ): DynamicModule {
    const connectionProvider = {
      provide: getConnectionToken(options as ConnectionOptions),
      useFactory: async (typeormOptions: ExpressCassandraModuleOptions) => {
        if (options.name) {
          return await this.createConnectionFactory({
            ...typeormOptions,
            name: options.name,
          });
        }
        return await this.createConnectionFactory(typeormOptions);
      },
      inject: [EXPRESS_CASSANDRA_MODULE_OPTIONS],
    };

    const asyncProviders = this.createAsyncProviders(options);
    return {
      module: ExpressCassandraCoreModule,
      imports: options.imports,
      providers: [
        ...asyncProviders,
        connectionProvider,
        {
          provide: EXPRESS_CASSANDRA_MODULE_ID,
          useValue: generateString(),
        },
      ],
      exports: [connectionProvider],
    };
  }

  async onModuleDestroy() {
    if (this.options.keepConnectionAlive) {
      return;
    }
    Logger.log('Closing connection', 'ExpressCassandraModule');
    const connection = this.moduleRef.get<Connection>(getConnectionToken(this
      .options as ConnectionOptions) as any);
    // tslint:disable-next-line:no-unused-expression
    connection && (await connection.closeAsync());
  }

  private static createAsyncProviders(
    options: ExpressCassandraModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: ExpressCassandraModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: EXPRESS_CASSANDRA_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: EXPRESS_CASSANDRA_MODULE_OPTIONS,
      useFactory: async (optionsFactory: ExpressCassandraOptionsFactory) =>
        await optionsFactory.createExpressCassandraOptions(),
      inject: [options.useClass || options.useExisting],
    };
  }

  private static async createConnectionFactory(
    options: ExpressCassandraModuleOptions,
  ): Promise<Connection> {
    const { retryAttempts, retryDelay, ...cassandraOptions } = options;
    const udts = cassandraOptions.udts
      ? reduceUdts(cassandraOptions.udts)
      : undefined;

    const connection = new Connection({
      ...cassandraOptions,
      ormOptions: {
        ...cassandraOptions.ormOptions,
        udts,
      },
    });

    return await defer(() => connection.initAsync())
      .pipe(
        handleRetry(retryAttempts, retryDelay),
        map(() => connection),
      )
      .toPromise();
  }
}
