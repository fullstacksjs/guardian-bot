import { Middleware } from 'telegraf-ts';
import { Context } from '../../../context';
import { User } from '../../../store';

export const onReject: Middleware<Context> = async ctx => {
  const { data, message } = ctx.callbackQuery;
  const userId = Number(data.split('-')[1]);

  if (!(await ctx.can('can_restrict_members'))) {
    ctx.replyWithRandomGif(ctx.gifs.unAuthorized);
    return;
  }

  await ctx.editMessageText('Kicked');
  await ctx.db.users.update<User>({ id: userId }, { $set: { status: 'ban' } });
  await ctx.telegram.kickChatMember(message.chat.id, userId);
  ctx.deleteMessage();
};
