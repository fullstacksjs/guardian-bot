import { Middleware } from 'telegraf';
import { Context } from '../../../context';

export const onPass: Middleware<Context> = async ctx => {
  const { data, from } = ctx.callbackQuery;

  const userId = Number(data.split('-')[1]);

  if (from.id !== userId) {
    return;
  }

  await ctx.db.users.update({ id: from.id }, { status: 'member' });

  await ctx.restrictChatMember(from.id, {
    can_send_other_messages: true,
    can_add_web_page_previews: true,
    can_send_media_messages: true,
    can_send_messages: true,
  });

  ctx.deleteMessage();
};
