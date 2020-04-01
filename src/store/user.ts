import Datastore from 'nedb-promises';

export function UserStore() {
  const users = new Datastore({
    autoload: true,
    filename: 'data/Users.db',
  });

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  users.ensureIndex({
    fieldName: 'id',
    unique: true,
  });

  return users;
}

export interface User {
  id: number;
  status?: 'admin' | 'restricted' | 'banned' | 'member';
}
