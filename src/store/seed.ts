import Datastore from 'nedb-promises';
import { Store } from './store';

export function SeedStore() {
  const seed = new Datastore({
    autoload: true,
    filename: 'data/Seed.db',
  });

  seed.ensureIndex({
    fieldName: 'store',
    unique: true,
  });

  return seed;
}

export interface Seed {
  store: keyof Store;
  seeded?: boolean;
}
