import { UserStore } from './user';
import { NoteStore } from './note';
import { LanguagStore } from './language';
import { SettingsStore } from './settings';
import { UrlStore } from './url';
import { GroupStore } from './groups';
import { SeedStore } from './seed';
import { seedDb } from './seeder';

export function createStore(): Store {
  const store: Store = {
    users: UserStore(),
    languages: LanguagStore(),
    notes: NoteStore(),
    settings: SettingsStore(),
    urls: UrlStore(),
    groups: GroupStore(),
    seed: SeedStore(),
  };

  seedDb(store);

  return store;
}

export const store = createStore();

export interface Store {
  seed: Datastore;
  users: Datastore;
  notes: Datastore;
  languages: Datastore;
  settings: Datastore;
  urls: Datastore;
  groups: Datastore;
}
