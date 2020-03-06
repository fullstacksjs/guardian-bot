import { Middleware } from 'telegraf';
import { Context } from '../../context';

const timeoutHandler: Middleware<Context> = (ctx, next) => {
  ctx.log('HandleTimeout');
  const timeout = ctx.settings.timeout;

  if (!timeout) {
    return next();
  }

  switch (ctx.updateType) {
    case 'message':
      if (new Date().getTime() / 1000 - ctx.message.date < timeout) {
        next();
      }
      break;
    case 'callback_query':
      if (ctx.callbackQuery.message && new Date().getTime() / 1000 - ctx.callbackQuery.message.date < timeout) {
        next();
      }
      break;
    default:
      return next();
  }
};

export default timeoutHandler;
