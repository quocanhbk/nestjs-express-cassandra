import { pascalToSnakeCase } from '../../utils/string';
import { UserDefinedTypeOptions } from '../interfaces/user-defined-type-options.interface';
import { setUserDefinedTypeName } from '../utils/decorator.utils';

export function UserDefinedType(
  nameOrOptions?: string | UserDefinedTypeOptions,
): ClassDecorator {
  return target => {
    const name =
      typeof nameOrOptions === 'string'
        ? nameOrOptions
        : nameOrOptions?.name || pascalToSnakeCase(target.name);
    setUserDefinedTypeName(target, name);
  };
}
