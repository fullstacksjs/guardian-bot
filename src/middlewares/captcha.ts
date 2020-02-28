import { Markup, Composer, ContextMessageUpdate } from 'telegraf';
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
    return ctx.telegram.kickChatMember(chat.id, newUser.id);
  }

  ctx.reply('Are you a 🤖?', {
    reply_to_message_id: message_id,
    reply_markup: Markup.inlineKeyboard([
      Markup.callbackButton('No', `no-${newUser.id}`),
      Markup.callbackButton('Kick (Admin Only)', `kick-${newUser.id}`),
    ]),
  });
});

captcha.action(/^(no)-(\d+)$/, (ctx: ContextMessageUpdate) => {
  ctx.editMessageText('Confirmed');
  ctx.deleteMessage();
});

export { captcha };
