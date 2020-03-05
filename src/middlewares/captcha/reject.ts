import { Middleware } from 'telegraf';
import { Context } from '../../context';

export const onReject: Middleware<Context> = async ctx => {
  const { data, message, from } = ctx.callbackQuery;
  const userId = Number(data.split('-')[1]);

  try {
    const canKick = await ctx.can(from.id, 'can_restrict_members');

    if (!canKick) {
      ctx.answerCbQuery('You Dont Have Permission!');
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
