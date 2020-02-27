import Datastore from 'nedb-promises';

export function NoteStore() {
  const notes = new Datastore({
    autoload: true,
    filename: 'data/Notes.db',
  });

  notes.ensureIndex({
    fieldName: 'title',
    unique: true,
  });

  return notes;
}

export interface Note {
  title: string;
  note: string;
}
