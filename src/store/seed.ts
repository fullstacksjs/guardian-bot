import Datastore from 'nedb-promises';
import { Store } from './store';

export function SeedStore() {
  const seed = new Datastore({
    autoload: true,
    filename: 'data/Seed.db',
  });

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
