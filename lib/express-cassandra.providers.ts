import { Provider } from '@nestjs/common';
import { defer, lastValueFrom } from 'rxjs';
import {
  BaseModel,
  Connection,
  ConnectionOptions,
  loadModel,
  Repository,
} from './orm';
import { RepositoryFactory } from './orm/repositories/repository.factory';
import { getEntity } from './orm/utils/decorator.utils';
import {
  getConnectionToken,
  getModelToken,
  getRepositoryToken,
} from './utils/cassandra-orm.utils';

export function createExpressCassandraProviders(
  entities: Function[] = [],
  connection?: Connection | ConnectionOptions | string,
) {
  const provideModel = (entity: Function) => ({
    provide: getModelToken(entity),
    useFactory: async (connectionLike: Connection) => {
      return await lastValueFrom(
        defer(() => loadModel(connectionLike, entity)),
      );
    },
    inject: [getConnectionToken(connection)],
  });

  const provideRepository = (entity: Function) => ({
    provide: getRepositoryToken(entity),
    useFactory: (model: BaseModel) => RepositoryFactory.create(entity, model),
    inject: [getModelToken(entity)],
  });

  const provideCustomRepository = (EntityRepository: typeof Repository) => {
    const entity = getEntity(EntityRepository);
    return {
      provide: getRepositoryToken(EntityRepository),
      useFactory: (model: BaseModel) =>
        RepositoryFactory.create(entity, model, EntityRepository),
      inject: [getModelToken(entity)],
    };
  };

  const providers: Provider[] = [];
  entities.forEach(entity => {
    if (entity.prototype instanceof Repository) {
      return providers.push(
        provideCustomRepository(entity as typeof Repository),
      );
    }
    return providers.push(provideModel(entity), provideRepository(entity));
  });

  return [...providers];
}
