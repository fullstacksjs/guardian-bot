import Datastore from 'nedb-promises';

export function UserStore() {
  const users = new Datastore({
    autoload: true,
    filename: 'data/Users.db',
  });

  users.ensureIndex({
    fieldName: 'id',
    unique: true,
  });

  return users;
}

export interface User {
  id: number;
  is_bot: boolean;
}
