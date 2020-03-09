import { Middleware, Composer } from 'this-is-a-package-for-draft-stuff-please-dont-use-this-one';
import { Context } from '../../context';

const restrictUserHandler: Middleware<Context> = async (ctx, next) => {
  const message = ctx.editedMessage || ctx.message;

  if (!message) {
    return next();
  }

  if (ctx.user?.status !== 'restricted') {
    return next();
  }

  ctx.log('User is Restricted');

  await ctx.deleteMessage();
};

export default Composer.chatType(['supergroup', 'group'], restrictUserHandler);
