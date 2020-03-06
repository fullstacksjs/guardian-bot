import { Composer } from 'telegraf';
import { Context } from '../../../context';
import { saveNote } from './saveNote';
import { hashtag, getNote } from './getNote';
import { update } from './updateNote';
import { listNotes } from './listNote';
import { removeNote } from './removeNote';

const notes = new Composer<Context>();

notes.command('get', getNote);
notes.command('notes', listNotes);
notes.hashtag(/.*/, hashtag);

notes.command('save', saveNote);
notes.command('update', update);
notes.command('remove', removeNote);

export { notes };
