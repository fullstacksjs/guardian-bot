import { Middleware, Composer } from 'this-is-a-package-for-draft-stuff-please-dont-use-this-one';
import { Context } from '../../context';

const leaveUnmanaged: Middleware<Context> = async (ctx, next) => {
  const isManaged = ctx.groups.some(group => group.id === ctx.chat.id);

  if (isManaged) {
    return next();
  }

  ctx.log('LeaveUnmanaged');

  await ctx.replyWithRandomGif(ctx.gifs.bye);
  await ctx.leaveChat();
};

export default Composer.chatType(['supergroup', 'group'], leaveUnmanaged);
