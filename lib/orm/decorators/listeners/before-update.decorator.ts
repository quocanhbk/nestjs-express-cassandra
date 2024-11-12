import { BEFORE_UPDATE } from '../../orm.constant';
import {
  addHookFunction,
  addOptions,
  getOptions,
} from '../../utils/decorator.utils';

export function BeforeUpdate(): MethodDecorator {
  return (
    target: Function,
    propertyKey: string | Symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const hookFuncLikeArray = Reflect.getMetadata(BEFORE_UPDATE, target) || [];
    hookFuncLikeArray.push(descriptor.value);
    Reflect.defineMetadata(BEFORE_UPDATE, hookFuncLikeArray, target);

    const { before_update } = getOptions(target);
    if (!before_update) {
      addOptions(target, {
        before_update: addHookFunction(target, BEFORE_UPDATE),
      });
    }
    return descriptor;
  };
}
