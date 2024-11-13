import { ColumnType, DataType } from './data.type';

export interface UserDefinedTypeColumnOptions {
  type: ColumnType | DataType | string;
}

export interface UserDefinedTypeOptions {
  name?: string;
}
