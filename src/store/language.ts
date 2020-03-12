import Datastore from 'nedb-promises';

export function LanguagStore() {
  const languages = new Datastore({
    autoload: true,
    filename: 'data/Languages.db',
  });

  languages.ensureIndex({
    fieldName: 'alias',
    unique: true,
  });

  languages.ensureIndex({
    fieldName: 'language',
  });

  return languages;
}

export interface Language {
  alias: string;
  language: string;
  parser?: string;
}
