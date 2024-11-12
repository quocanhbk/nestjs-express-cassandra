import { AFTER_SAVE } from '../../orm.constant';
import {
  addHookFunction,
  addOptions,
  getOptions,
} from '../../utils/decorator.utils';

export function AfterSave(): MethodDecorator {
  return (
    target: Function,
    propertyKey: string | Symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const hookFuncLikeArray = Reflect.getMetadata(AFTER_SAVE, target) || [];
    hookFuncLikeArray.push(descriptor.value);
    Reflect.defineMetadata(AFTER_SAVE, hookFuncLikeArray, target);

    const { after_save } = getOptions(target);
    if (!after_save) {
      addOptions(target, { after_save: addHookFunction(target, AFTER_SAVE) });
    }
    return descriptor;
  };
}
