import pluralize from 'pluralize';
import { pascalToSnakeCase } from '../../utils/string';
import { EntityOptions } from '../interfaces';
import { addOptions, setEntityName } from '../utils/decorator.utils';

export function Entity<T extends new (...args: any[]) => any>(
  options?: EntityOptions<InstanceType<T>>,
): ClassDecorator<T>;
export function Entity<T extends new (...args: any[]) => any>(
  name?: string,
  options?: EntityOptions<InstanceType<T>>,
): ClassDecorator<T>;
export function Entity(
  nameOrOptions?: string | EntityOptions<any>,
  maybeOptions?: EntityOptions<any>,
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

  const options: EntityOptions =
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

type ClassDecorator<T = any> = (target: T) => void | T;
