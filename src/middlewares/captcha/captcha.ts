import { Middleware, Markup } from 'telegraf';
import { findOrCreate } from '../../utils';
import { Context } from '../../context';
import { User } from '../../store';

export const showCaptcha: Middleware<Context> = async (ctx, next) => {
  const { new_chat_members, chat, from } = ctx.update.message;

  const newUser = new_chat_members.find(member => member.id === from.id);

  if (!newUser) {
    next();
    return;
  }

  const user = await findOrCreate<User>(ctx.db.users, { id: newUser.id }, { id: newUser.id });

  if (user.isBot) {
    ctx.telegram.kickChatMember(chat.id, newUser.id);
    return;
  }

  if (ctx.chat.type === 'supergroup') {
    ctx.telegram.restrictChatMember(chat.id, newUser.id);
  }

  ctx.reply(`Hey, ${newUser.first_name} ${newUser.username}. Are you a 🤖?`, {
    reply_markup: Markup.inlineKeyboard([
      Markup.callbackButton('No', `no-${newUser.id}`),
      Markup.callbackButton('Kick (Admin Only)', `kick-${newUser.id}`),
    ]),
  });
};
