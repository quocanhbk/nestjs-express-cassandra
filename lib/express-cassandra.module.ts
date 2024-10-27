import { DynamicModule, Module } from '@nestjs/common';
import { ExpressCassandraCoreModule } from './express-cassandra-core.module';
import { createExpressCassandraProviders } from './express-cassandra.providers';
import {
  ExpressCassandraModuleAsyncOptions,
  ExpressCassandraModuleOptions,
} from './interfaces';
import { Connection, ConnectionOptions } from './orm';

@Module({})
export class ExpressCassandraModule {
  static forRoot(options: ExpressCassandraModuleOptions): DynamicModule {
    return {
      module: ExpressCassandraModule,
      imports: [ExpressCassandraCoreModule.forRoot(options)],
    };
  }

  static forFeature(
    entities: Function[] = [],
    connection: Connection | ConnectionOptions | string = 'default',
  ): DynamicModule {
    const providers = createExpressCassandraProviders(entities, connection);
    return {
      module: ExpressCassandraModule,
      providers,
      exports: providers,
    };
  }

  static forRootAsync(
    options: ExpressCassandraModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: ExpressCassandraModule,
      imports: [ExpressCassandraCoreModule.forRootAsync(options)],
    };
  }
}
