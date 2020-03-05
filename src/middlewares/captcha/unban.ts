import { Middleware } from 'telegraf';
import { Context } from '../../context';

export const unban: Middleware<Context> = async ctx => {
  const userId = Number(ctx.message.text.split(' ')[1]);

  const canUnban = await ctx.can(ctx.from.id, 'can_restrict_members');

  if (!canUnban) {
    ctx.answerCbQuery('You Dont Have Permission!');
    return;
  }

  ctx.telegram.unbanChatMember(ctx.message.chat.id, userId);
  ctx.db.users.update({ id: userId }, { isBot: false });
};
