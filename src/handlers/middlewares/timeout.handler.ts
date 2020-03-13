import { Middleware } from 'telegraf-ts';
import { Context } from '../../context';

const timeoutHandler: Middleware<Context> = (ctx, next) => {
  const timeout = ctx.settings.timeout || process.env.DEFAULT_TIMEOUT;

  if (!timeout) {
    return next();
  }

  const now = new Date().getTime() / 1000;

  switch (ctx.updateType) {
    case 'message':
      if (now - ctx.message.date < timeout) {
        return next();
      }
      break;
    case 'callback_query':
      if (ctx.callbackQuery.message && now - ctx.callbackQuery.message.date < timeout) {
        return next();
      }
      break;
    default:
      return next();
  }
};

export default timeoutHandler;
