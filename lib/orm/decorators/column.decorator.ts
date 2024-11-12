import { ColumnOptions } from '../interfaces';
import { timeuuid, uuid } from '../utils/db.utils';
import { addAttribute, addOptions, getOptions } from '../utils/decorator.utils';
import { BeforeSave } from './listeners';

export function Column(options: ColumnOptions): PropertyDecorator {
  return (target: Function, propertyName: string) => {
    addAttribute(target, propertyName, options);
  };
}

export function GeneratedUUidColumn(
  type: 'uuid' | 'timeuuid' = 'uuid',
): PropertyDecorator {
  return (target: Function, propertyName: string) => {
    const fn: PropertyDescriptor = {
      value: (...args: any[]) => {
        const instance = args[0];
        if (instance !== null && !instance[propertyName]) {
          instance[propertyName] = type === 'timeuuid' ? timeuuid() : uuid();
        }
      },
    };

    Column({
      type,
      default: { $db_function: type === 'timeuuid' ? 'now()' : 'uuid()' },
    })(target, propertyName);
    BeforeSave()(target, propertyName, fn);
  };
}

export function VersionColumn(): PropertyDecorator {
  return (target: Function, propertyName: string) => {
    addOptions(target, { options: { versions: { key: propertyName } } });
  };
}

export function CreateDateColumn(): PropertyDecorator {
  return (target: Function, propertyName: string) => {
    addOptions(target, {
      options: { timestamps: { createdAt: propertyName } },
    });
  };
}

export function UpdateDateColumn(): PropertyDecorator {
  return (target: Function, propertyName: string) => {
    addOptions(target, {
      options: { timestamps: { updatedAt: propertyName } },
    });
  };
}

export function IndexColumn(): PropertyDecorator {
  return (target: Function, propertyName: string) => {
    let { indexes } = getOptions(target);
    indexes = indexes || [];

    const isAdded = (indexes as string[]).some(value => value === propertyName);
    if (isAdded) {
      return;
    }

    indexes.push(propertyName);
    addOptions(target, { indexes });
  };
}
