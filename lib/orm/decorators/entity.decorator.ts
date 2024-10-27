import { pascalToSnakeCase } from '../../utils/string';
import { EntityOptions } from '../interfaces';
import { addOptions, setEntityName } from '../utils/decorator.utils';

export function Entity<T = any>(options?: EntityOptions<T>): ClassDecorator;
export function Entity<T = any>(
  name?: string,
  options?: EntityOptions<T>,
): ClassDecorator;
export function Entity(
  nameOrOptions?: string | EntityOptions,
  maybeOptions?: EntityOptions,
): ClassDecorator {
  const options: any =
    (typeof nameOrOptions === 'object'
      ? (nameOrOptions as EntityOptions)
      : maybeOptions) || {};

  return (target): void => {
    const name =
      typeof nameOrOptions === 'string'
        ? nameOrOptions
        : options.table_name || pascalToSnakeCase(target.name);

    options.instanceMethods = target.prototype;
    options.classMethods = target;

    setEntityName(target.prototype, name);
    addOptions(target.prototype, options);
  };
}
