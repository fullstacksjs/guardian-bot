import path from 'path';
import R from 'ramda';
import { MessageEntity, ChatMember } from 'telegram-typings';
import { Context } from '../context';

export const isPre = R.propEq('type', 'pre');

export const isNullOrEmpty = R.anyPass([R.isNil, R.isEmpty]);

export const getEntityText = (str: string, entity: MessageEntity) =>
  str.slice(entity.offset, entity.offset + entity.length);

export const ROOT = path.resolve(path.dirname(require.main.filename), '..');

export const resolveRoot = (...routes: string[]) => path.resolve(ROOT, ...routes);

export const resolveModule = (...routes: string[]) => resolveRoot('node_modules', ...routes);

export async function findOrCreate<T>(model: Datastore, query: any, data: T): Promise<T> {
  const resource = await model.findOne<T>(query);

  if (resource) {
    return resource;
  }

  return model.insert<T>(data);
}
