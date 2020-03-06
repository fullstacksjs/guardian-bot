import { Middleware } from 'telegraf';
import { Context } from '../../context';

const unban: Middleware<Context> = async ctx => {
  const userId = Number(ctx.message.text.split(' ')[1]);

  if (!(await ctx.can('can_restrict_members'))) {
    ctx.replyWithRandomGif(ctx.gifs.unAuthorized);
    return;
  }

  ctx.unbanChatMember(userId);
  ctx.db.users.update({ id: userId }, { $set: { status: 'memeber' } });
};

export default unban;
