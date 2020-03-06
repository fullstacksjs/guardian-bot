import { Middleware, Markup } from 'telegraf';
import { findOrCreate, getUsername } from '../../../utils';
import { Context } from '../../../context';
import { User } from '../../../store';

const captchaHandler: Middleware<Context> = async (ctx, next) => {
  const { new_chat_members, from } = ctx.update.message;

  const newUser = new_chat_members.find(member => member.id === from.id);

  if (!newUser) {
    next();
    return;
  }

  const user = await findOrCreate<User>(ctx.db.users, { id: newUser.id }, { id: newUser.id, status: 'restricted' });

  if (user.isBot) {
    ctx.kickChatMember(newUser.id);
    return;
  }

  if (ctx.chat.type === 'supergroup') {
    ctx.restrictChatMember(newUser.id);
  }

  ctx.reply(`Hey, ${getUsername(ctx.from)}. Are you a 🤖?`, {
    reply_markup: Markup.inlineKeyboard([
      Markup.callbackButton('No', `no-${newUser.id}`),
      Markup.callbackButton('Kick (Admin Only)', `kick-${newUser.id}`),
    ]),
  });

  next();
};

export default captchaHandler;
