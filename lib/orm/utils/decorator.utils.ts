import 'reflect-metadata';
import {
  ATTRIBUTE_KEY,
  ENTITY_METADATA,
  ENTITY_NAME_KEY,
  OPTIONS_KEY,
  USER_DEFINED_TYPE_NAME_KEY,
} from '../../orm/orm.constant';
import { mergeDeep } from '../../orm/utils/deep-merge.utils';

export function setEntity(target: object, entity: Function): void {
  Reflect.defineMetadata(ENTITY_METADATA, entity, target);
}

export function getEntity(target: object): Function {
  return Reflect.getMetadata(ENTITY_METADATA, target);
}

export function setEntityName(target: object, modelName: string): void {
  Reflect.defineMetadata(ENTITY_NAME_KEY, modelName, target);
}

export function getEntityName(target: object): string {
  return Reflect.getMetadata(ENTITY_NAME_KEY, target);
}

export function setUserDefinedTypeName(target: object, name: string): void {
  Reflect.defineMetadata(USER_DEFINED_TYPE_NAME_KEY, name, target);
}

export function getUserDefinedTypeName(target: object): string {
  return Reflect.getMetadata(USER_DEFINED_TYPE_NAME_KEY, target);
}

export function getAttributes(target: object): Record<string, any> {
  const attributes = Reflect.getMetadata(ATTRIBUTE_KEY, target);

  if (attributes) {
    return Object.keys(attributes).reduce(
      (copy, key) => {
        copy[key] = { ...attributes[key] };
        return copy;
      },
      {} as Record<string, any>,
    );
  }

  return {};
}

export function setAttributes(
  target: object,
  attributes: Record<string, any>,
): void {
  Reflect.defineMetadata(ATTRIBUTE_KEY, { ...attributes }, target);
}

export function addAttribute(target: object, name: string, options: any): void {
  const attributes = getAttributes(target);
  attributes[name] = { ...options };
  setAttributes(target, attributes);
}

export function addAttributeOptions(
  target: object,
  propertyName: string,
  options: any,
): void {
  const attributes = getAttributes(target);
  attributes[propertyName] = mergeDeep(attributes[propertyName], options);
  setAttributes(target, attributes);
}

export function getOptions(target: object): Record<string, any> {
  const options = Reflect.getMetadata(OPTIONS_KEY, target);
  return options ? { ...options } : {};
}

export function setOptions(target: object, options: Record<string, any>): void {
  Reflect.defineMetadata(OPTIONS_KEY, { ...options }, target);
}

export function addOptions(target: object, options: Record<string, any>): void {
  const mOptions = getOptions(target) || {};
  setOptions(target, mergeDeep(mOptions, options));
}

export const addHookFunction = (
  target: object,
  metadataKey: string,
): ((...args: any[]) => any[]) => {
  const funcLikeArray: any[] = Reflect.getMetadata(metadataKey, target) || [];
  return (...args: any[]) => funcLikeArray.map(funcLike => funcLike(...args));
};
