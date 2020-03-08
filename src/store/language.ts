import Datastore from 'nedb-promises';
import { noop } from '@frontendmonster/utils';
import hljs from 'highlight.js';
import parsers from '../assets/parsers.json';

function seedLanguages(db: Datastore) {
  return Promise.all(
    hljs.listLanguages().map(lang => db.insert({ language: lang, alias: lang, parser: (parsers as any)[lang] })),
  );
}

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

  languages
    .findOne<boolean>({ seed: true })
    .then(seeded => {
      if (seeded) {
        throw Error('AlreadySeeded');
      }
      return seedLanguages(languages);
    })
    .then(() => {
      languages.insert({ alias: 'SEEDED', seed: true });
    })
    .catch(noop);

  return languages;
}

export interface Language {
  alias: string;
  language: string;
  parser?: string;
}
