import { Middleware, Composer } from 'telegraf';
import { Context } from '../../context';

const restrictUserHandler: Middleware<Context> = async (ctx, next) => {
  ctx.log('Check Restricted User');
  const message = ctx.editedMessage || ctx.message;

  if (!message) {
    return next();
  }

  if (ctx.user?.status !== 'restricted') {
    return next();
  }

  await ctx.deleteMessage();
};

export default Composer.chatType(['supergroup', 'group'], restrictUserHandler);
