import pluralize from 'pluralize';
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
  // Add validation
  if (
    typeof nameOrOptions === 'string' &&
    maybeOptions &&
    maybeOptions.table_name
  ) {
    throw new Error(
      'Cannot specify table name in both parameters. Use either string parameter or options.table_name, not both.',
    );
  }

  const options: any =
    (typeof nameOrOptions === 'object'
      ? (nameOrOptions as EntityOptions)
      : maybeOptions) || {};

  return (target): void => {
    const name =
      typeof nameOrOptions === 'string'
        ? nameOrOptions
        : options.table_name || pluralize(pascalToSnakeCase(target.name));

    options.instanceMethods = target.prototype;
    options.classMethods = target;

    setEntityName(target, name);
    addOptions(target, options);
  };
}
