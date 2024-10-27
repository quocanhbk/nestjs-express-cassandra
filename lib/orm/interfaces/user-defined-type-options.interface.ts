import { ColumnType, DataType } from './data.type';

export interface UserDefinedTypeColumnOptions {
  type: ColumnType | DataType;
}

export interface UserDefinedTypeOptions {
  name: string;
}
