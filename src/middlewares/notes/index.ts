import { Composer } from 'telegraf';
import { Context } from '../../context';
import { save } from './save';
import { hashtag, command } from './get';
import { update } from './update';
import { getAll } from './getAll';
import { remove } from './remove';

const notes = new Composer<Context>();

notes.command('save', save);
notes.command('get', command);
notes.command('update', update);
notes.command('notes', getAll);
notes.command('remove', remove);

notes.on('text', ctx => {
  const { message } = ctx;

  if (message.text.split(' ')[0][0] === '#') {
    hashtag(ctx);
  }
});

export { notes };
