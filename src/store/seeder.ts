import hljs from 'highlight.js';
import parsers from '../assets/parsers';
import { Store } from './store';
import { Seed } from './seed';

function seedLanguages(db: Datastore) {
  return Promise.all(
    hljs.listLanguages().map(lang =>
      db.insert({
        language: lang,
        alias: lang,
        parser: (parsers as any)[lang],
      }),
    ),
  );
}

export async function seedDb(store: Store) {
  const seed = await store.seed.findOne<Seed>({ store: 'languages' } as Seed);
  if (seed?.seeded) return;

  await seedLanguages(store.languages);
  await store.seed.insert<Seed>({ store: 'languages', seeded: true });
}
