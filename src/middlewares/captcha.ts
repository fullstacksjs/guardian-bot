import { Markup, Composer, ContextMessageUpdate } from 'telegraf';
import { Context } from '../context';

const captcha = new Composer<Context>();

captcha.on('new_chat_members', ctx => {
  const { new_chat_members, chat, from, message_id } = ctx.update.message;

  new_chat_members.forEach(async new_user => {
    if (new_user.id === from.id) {
      await ctx.db.users
        .findOne({
          id: new_user.id,
        })
        .then(async user => {
          if (!user) {
            await ctx.db.users
              .insert({
                id: new_user.id,
              })
              .then(res => {
                user = res;
              });
          }
          if (user.is_bot === null) {
            ctx.reply('Are you a 🤖?', {
              reply_to_message_id: message_id,
              reply_markup: Markup.inlineKeyboard([
                Markup.callbackButton('No', `no-${new_user.id}`),
                Markup.callbackButton('Kick (Admin Only)', `kick-${new_user.id}`),
              ]),
            });
          } else if (user.is_bot) {
            ctx.kickChatMember(chat.id, new_user.id);
          }
        });
    }
  });
});

captcha.action(/^(no)-(\d+)$/, (ctx: ContextMessageUpdate) => {
  ctx.editMessageText('Confirmed');
  ctx.deleteMessage();
});

export { captcha };
