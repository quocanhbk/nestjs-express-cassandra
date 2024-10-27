import { Type } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { ConnectionOptions } from '../orm';

export type ExpressCassandraModuleOptions = {
  retryAttempts?: number;

  retryDelay?: number;

  keepConnectionAlive?: boolean;

  udts?: Function[];
} & Partial<ConnectionOptions>;

export interface ExpressCassandraOptionsFactory {
  createExpressCassandraOptions():
    | Promise<ExpressCassandraModuleOptions>
    | ExpressCassandraModuleOptions;
}

export interface ExpressCassandraModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;

  useExisting?: Type<ExpressCassandraOptionsFactory>;

  useClass?: Type<ExpressCassandraOptionsFactory>;

  useFactory?: (
    ...args: any[]
  ) => Promise<ExpressCassandraModuleOptions> | ExpressCassandraModuleOptions;

  inject?: any[];
}
