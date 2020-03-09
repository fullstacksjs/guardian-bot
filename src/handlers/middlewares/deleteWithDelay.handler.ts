import { Middleware } from 'this-is-a-package-for-draft-stuff-please-dont-use-this-one';
import { Context } from '../../context';

const deleteWithDelay: Middleware<Context> = async (ctx, next) => {
  ctx.log('Delete Message');
  if (typeof ctx.settings.deleteDelay === 'number') {
    setTimeout(ctx.deleteMessage, ctx.settings.deleteDelay);
  } else {
    await ctx.deleteMessage();
  }

  next();
};

export default deleteWithDelay;
