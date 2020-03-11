import path from 'path';
import R from 'ramda';
import { User } from 'telegraf-ts';
import { Group } from '../store';

interface Document {
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const isPre = R.propEq('type', 'pre');

export const isNullOrEmpty = R.anyPass([R.isNil, R.isEmpty]);

export const ROOT = path.resolve(path.dirname(require.main.filename), '..');

export const resolveRoot = (...routes: string[]) => path.resolve(ROOT, ...routes);

export const resolveModule = (...routes: string[]) => resolveRoot('node_modules', ...routes);

export async function findOrCreate<T>(model: Datastore, query: any, data: T): Promise<T & Document> {
  const resource = await model.findOne<T>(query);

  if (resource) {
    return resource;
  }

  return model.insert<T>(data);
}

export async function createOrUpdate<T>(model: Datastore, query: any, data: T): Promise<T & Document> {
  const resource = await model.findOne<T>(query);

  return resource ? model.update<T>(query, data, { returnUpdatedDocs: true }) : model.insert<T>(data);
}

export const giphy = (str: string) => `https://media.giphy.com/media/${str}/giphy.gif`;

export const getUsername = (user: User) => {
  let name = user.first_name;
  if (user.last_name) name += ` ${user.last_name}`;
  if (user.username) name += ` (@${user.username})`;

  return name;
};

export const getGroupname = (group: Group) => {
  let name = group.title;
  if (group.link) name += ` (${group.link})`;

  return name;
};
