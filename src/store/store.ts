import { UserStore } from './user';
import { NoteStore } from './note';
import { LanguagStore } from './language';
import { SettingsStore } from './settings';
import { UrlStore } from './url';
import { GroupStore } from './groups';

export function createStore(): Store {
  const store: Store = {
    users: UserStore(),
    languages: LanguagStore(),
    notes: NoteStore(),
    settings: SettingsStore(),
    urls: UrlStore(),
    groups: GroupStore(),
  };

  return store;
}

export const store = createStore();

export interface Store {
  users: Datastore;
  notes: Datastore;
  languages: Datastore;
  settings: Datastore;
  urls: Datastore;
  groups: Datastore;
}
