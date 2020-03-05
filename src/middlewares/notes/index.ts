import { Composer } from 'telegraf';
import { Context } from '../../context';
import { saveNote } from './saveNote';
import { hashtag, getNote } from './getNote';
import { update } from './updateNote';
import { listNotes } from './listNote';
import { remove } from './removeNote';

const notes = new Composer<Context>();

notes.command('save', saveNote);
notes.command('get', getNote);
notes.command('update', update);
notes.command('notes', listNotes);
notes.command('remove', remove);

notes.on('text', hashtag);

export { notes };
