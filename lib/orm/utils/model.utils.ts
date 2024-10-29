import { Logger } from '@nestjs/common';
import { Connection } from '../interfaces';
import { getAttributes, getEntityName, getOptions } from './decorator.utils';

export function loadModel(
  connection: Connection,
  entity: Function,
): Promise<any> {
  const schema = getSchema(entity);
  const modelName = getEntityName(entity);
  const model = connection.loadSchema(modelName, schema);

  return new Promise(resolve => {
    model.syncDB(err => {
      if (err) {
        Logger.error(err.message, err.stack, 'ExpressCassandraModule');
        return resolve(model);
      }
      return resolve(model);
    });
  });
}

export function getSchema(entity: Function) {
  const attributes = getAttributes(entity.prototype);
  const { instanceMethods, classMethods, ...options } = getOptions(
    entity.prototype,
  );
  const model = { ...options };
  model.fields = { ...attributes };
  return model;
}
