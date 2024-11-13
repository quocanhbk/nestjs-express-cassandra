import { UserDefinedTypeColumnOptions } from '../interfaces/user-defined-type-options.interface';
import { addAttribute } from '../utils/decorator.utils';

export function UserDefinedTypeColumn(
  options: UserDefinedTypeColumnOptions,
): PropertyDecorator {
  return (target: Function, propertyName: string) => {
    addAttribute(target, propertyName, options);
  };
}
