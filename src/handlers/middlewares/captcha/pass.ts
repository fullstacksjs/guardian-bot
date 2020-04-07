import { Middleware } from 'telegraf-ts';
import { Context } from '../../../context';

export const onPass: Middleware<Context> = async ctx => {
  const { data, from } = ctx.callbackQuery;

  const userId = Number(data.split('-')[1]);

  if (from.id !== userId && !ctx.isAdmin) {
    return undefined;
  }

  await ctx.db.users.update({ id: userId }, { $set: { status: 'member' } });

  if (ctx.chat.type === 'supergroup') {
    await ctx.restrictChatMember(userId, {
      can_send_other_messages: true,
      can_add_web_page_previews: true,
      can_send_media_messages: true,
      can_send_messages: true,
    });
  }

  return ctx.deleteMessage();
};
