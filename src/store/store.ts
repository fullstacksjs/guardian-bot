import { UserStore } from './user';
import { NoteStore } from './note';

export function createStore(): Store {
  const users = UserStore();
  const notes = NoteStore();

  return {
    users,
    notes,
  };
}

export interface Store {
  users: Datastore;
  notes: Datastore;
}
