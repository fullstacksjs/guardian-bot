import { Middleware } from 'telegraf-ts';
import { Context } from '../../context';

const deleteWithDelay: Middleware<Context> = async (ctx, next) => {
  ctx.log('Delete Message');
  if (typeof ctx.settings.deleteDelay === 'number') {
    setTimeout(() => ctx.deleteMessage, ctx.settings.deleteDelay);
  } else {
    await ctx.deleteMessage();
  }

  next();
};

export default deleteWithDelay;
