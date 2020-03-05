import { Composer } from 'telegraf';
import { Context } from '../../context';

const silent = new Composer<Context>();

silent.on('new_chat_members', (ctx, next) => {
  ctx.deleteMessage();
  next();
});

silent.on('left_chat_member', (ctx, next) => {
  ctx.deleteMessage();
  next();
});

export { silent };
