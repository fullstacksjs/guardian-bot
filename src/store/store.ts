import { UserStore } from './user';

export function createStore(): Store {
  const users = UserStore();

  return {
    users,
  };
}

export interface Store {
  users: Datastore;
}
