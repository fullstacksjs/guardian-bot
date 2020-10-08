import { Middleware } from 'telegraf-ts';
import { Context } from '../../context';

const deleteWithDelay: Middleware<Context> = async (ctx, next) => {
  if (typeof ctx.settings.deleteDelay === 'number') {
    setTimeout(() => ctx.deleteMessage, ctx.settings.deleteDelay);
  } else {
    ctx.log('Delete Message');
    await ctx.deleteMessage();
  }

  return next();
};

export default deleteWithDelay;
