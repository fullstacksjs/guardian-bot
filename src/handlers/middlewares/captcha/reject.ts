import { Middleware } from 'telegraf';
import { Context } from '../../../context';

export const onReject: Middleware<Context> = async ctx => {
  const { data, message } = ctx.callbackQuery;
  const userId = Number(data.split('-')[1]);

  try {
    if (!(await ctx.can('can_restrict_members'))) {
      ctx.replyWithRandomGif(ctx.gifs.unAuthorized);
      return;
    }

    ctx.editMessageText('Kicked');
    ctx.db.users.update({ id: userId }, { isBot: true });

    ctx.telegram.kickChatMember(message.chat.id, userId);
    ctx.deleteMessage();
  } catch (e) {
    ctx.log(e);
    throw e;
  }
};
