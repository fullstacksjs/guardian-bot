import Datastore from 'nedb-promises';

export function LanguagStore() {
  const users = new Datastore({
    autoload: true,
    filename: 'data/Languages.db',
  });

  users.ensureIndex({
    fieldName: 'alias',
    unique: true,
  });

  return users;
}

export interface Language {
  alias: string;
  language: string;
}
