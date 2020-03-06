import { Middleware, Composer } from 'telegraf';
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
