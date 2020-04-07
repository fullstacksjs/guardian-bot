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

export type UserRole =
  | 'admin'
  | 'restricted'
  | 'banned'
  | 'member'
  | 'superuser';

export interface User {
  id: number;
  status?: UserRole;
}
