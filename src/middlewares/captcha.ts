import { Markup, Composer } from 'telegraf';
import { Context } from '../context';
import { User } from '../store';

const captcha = new Composer<Context>();

async function findOrCreate<T>(model: Datastore, query: any, data: T): Promise<T> {
  const resource = await model.findOne<T>(query);

  if (resource) {
    return resource;
  }

  return model.insert<T>(data);
}

captcha.on('new_chat_members', async ctx => {
  const { new_chat_members, chat, from, message_id } = ctx.update.message;

  const newUser = new_chat_members.find(member => member.id === from.id);

  const user = await findOrCreate<User>(ctx.db.users, { id: newUser.id }, { id: newUser.id });

  if (user.isBot) {
    ctx.telegram.kickChatMember(chat.id, newUser.id);
    return;
  }

  ctx.telegram.restrictChatMember(chat.id, newUser.id);

  ctx.reply('Are you a 🤖?', {
    reply_to_message_id: message_id,
    reply_markup: Markup.inlineKeyboard([
      Markup.callbackButton('No', `no-${newUser.id}`),
      Markup.callbackButton('Kick (Admin Only)', `kick-${newUser.id}`),
    ]),
  });
});

captcha.action(/^(no)-(\d+)$/, ctx => {
  const userId = ctx.callbackQuery.data.split('-')[1];
  if (ctx.callbackQuery.from.id !== Number(userId)) {
    ctx.answerCbQuery('You Dont Have Permission!!');
    return;
  }
  ctx.telegram.restrictChatMember(ctx.callbackQuery.message.chat.id, ctx.callbackQuery.from.id, {
    can_send_other_messages: true,
    can_add_web_page_previews: true,
    can_send_media_messages: true,
    can_send_messages: true,
  });
  ctx.deleteMessage();
});

captcha.action(/^(kick)-(\d+)$/, ctx => {
  // FIX ME: Add admin condition and set isBot to true
  const userId = ctx.callbackQuery.data.split('-')[1];
  ctx.editMessageText('Kicked');
  ctx.db.users.update({ id: userId }, { isBot: true });
  ctx.telegram.kickChatMember(ctx.callbackQuery.message.chat.id, Number(userId));
  ctx.deleteMessage();
});

captcha.command('unban', ctx => {
  // Fix me: Add admin condition
  const userId = ctx.message.text.split(' ')[1];
  ctx.telegram.unbanChatMember(ctx.message.chat.id, Number(userId));
  ctx.db.users.update({ id: userId }, { isBot: false });
});
export { captcha };
