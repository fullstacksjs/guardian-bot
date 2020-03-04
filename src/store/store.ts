import { UserStore } from './user';
import { NoteStore } from './note';
import { LanguagStore } from './language';

export function createStore(): Store {
  const store: Store = {
    users: UserStore(),
    languages: LanguagStore(),
    notes: NoteStore(),
  };

  return store;
}

export const store = createStore();

export interface Store {
  users: Datastore;
  notes: Datastore;
  languages: Datastore;
}
