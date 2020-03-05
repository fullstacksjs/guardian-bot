import { Middleware } from 'telegraf';
import { Context } from '../../context';

export const onPass: Middleware<Context> = ctx => {
  const { data, from, message } = ctx.callbackQuery;

  const userId = Number(data.split('-')[1]);

  if (from.id !== userId) {
    ctx.answerCbQuery('You Dont Have Permission!!');
    return;
  }

  ctx.telegram.restrictChatMember(message.chat.id, from.id, {
    can_send_other_messages: true,
    can_add_web_page_previews: true,
    can_send_media_messages: true,
    can_send_messages: true,
  });

  ctx.deleteMessage();
};
