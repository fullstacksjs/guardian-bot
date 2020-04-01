import Datastore from 'nedb-promises';
import { ChatType } from 'telegraf-ts';

export function GroupStore() {
  const group = new Datastore({
    autoload: true,
    filename: 'data/Groups.db',
  });

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  group.ensureIndex({
    fieldName: 'id',
    unique: true,
  });

  return group;
}

export interface Group {
  id: number | string;
  link?: string;
  title: string;
  type: ChatType;
}
