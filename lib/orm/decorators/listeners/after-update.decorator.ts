import { AFTER_UPDATE } from '../../orm.constant';
import {
  addHookFunction,
  addOptions,
  getOptions,
} from '../../utils/decorator.utils';

export function AfterUpdate(): MethodDecorator {
  return (
    target: Function,
    propertyKey: string | Symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const hookFuncLikeArray = Reflect.getMetadata(AFTER_UPDATE, target) || [];
    hookFuncLikeArray.push(descriptor.value);
    Reflect.defineMetadata(AFTER_UPDATE, hookFuncLikeArray, target);

    const { after_update } = getOptions(target);
    if (!after_update) {
      addOptions(target, {
        after_update: addHookFunction(target, AFTER_UPDATE),
      });
    }
    return descriptor;
  };
}
