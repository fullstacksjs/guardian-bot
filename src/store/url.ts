import Datastore from 'nedb-promises';

export function UrlStore() {
  const urls = new Datastore({
    autoload: true,
    filename: 'data/Urls.db',
  });

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  urls.ensureIndex({
    fieldName: 'pattern',
    unique: true,
  });

  return urls;
}

export interface Url {
  pattern: string;
  status?: 'trusted' | 'forbidden';
}
