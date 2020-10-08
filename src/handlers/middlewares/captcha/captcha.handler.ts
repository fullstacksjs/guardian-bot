import { Middleware, Markup } from 'telegraf-ts';
import { findOrCreate, getUsername } from '../../../utils';
import { Context } from '../../../context';
import { User } from '../../../store';

const captchaHandler: Middleware<Context> = async (ctx, next) => {
  const { new_chat_members, from } = ctx.update.message;

  const newUser = new_chat_members.find(member => member.id === from.id);

  if (!newUser) {
    return next();
  }

  const user = await findOrCreate<User>(
    ctx.db.users,
    { id: newUser.id },
    { id: newUser.id, status: 'restricted' },
  );

  if (ctx.from.is_bot) {
    await ctx.kickChatMember(newUser.id);
    await ctx.db.users.update<User>(
      { id: user.id },
      { $set: { status: 'banned' } },
    );
    return;
  }

  if (ctx.chat.type === 'supergroup') {
    await ctx.restrictChatMember(newUser.id);
  }

  await ctx.db.users.update<User>(
    { id: user.id },
    { $set: { status: 'restricted' } },
  );
  await ctx.reply(`Hey, ${getUsername(ctx.from)}. Are you a 🤖?`, {
    reply_markup: Markup.inlineKeyboard([
      Markup.callbackButton('No', `no-${newUser.id}`),
      Markup.callbackButton('Kick (Admin Only)', `kick-${newUser.id}`),
    ]),
  });

  return next();
};

export default captchaHandler;
