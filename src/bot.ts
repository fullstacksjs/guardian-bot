import Telegraf from 'telegraf';
import { Context } from './context';
import { BotConfig } from './config';
import { middlewares } from './middlewares';

import saveNote from './note/save';
import * as getNote from './note/get';
import updateNote from './note/update';
import getAllNotes from './note/get-all';
import removeNote from './note/remove';

export function Bot({ token, name }: BotConfig) {
  const bot = new Telegraf<Context>(token, { contextType: Context });

  bot.command('save', saveNote);
  bot.command('get', getNote.command);
  bot.command('update', updateNote);
  bot.command('notes', getAllNotes);
  bot.command('remove', removeNote);

  bot.on('text', ctx => {
    const { message } = ctx;

    if (message.text.split(' ')[0][0] === '#') {
      getNote.hashtag(ctx);
    }
  });

  bot.use(middlewares);

  return bot;
}
