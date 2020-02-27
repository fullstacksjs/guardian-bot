import { Middleware } from 'telegraf';
import { Context } from '../../context';

export const remove: Middleware<Context> = ctx => {
  const { message } = ctx;
  const messageID = message.message_id;

  if (message.text.split(' ').length < 2) {
    return;
  }

  const noteTitle = message.text.split(' ')[1].toLowerCase();

  ctx.db.notes
    .findOne({ title: noteTitle })
    .then(res => {
      if (!res) {
        ctx.reply(`${noteTitle} doesn't exist`, { reply_to_message_id: messageID });
      }
      ctx.db.notes
        .remove({ title: noteTitle }, {})
        .then(res => {
          ctx.reply(`Removed note ${noteTitle}`, { reply_to_message_id: messageID });
        })
        .catch(err => {
          throw new Error(err);
        });
    })
    .catch(err => {
      throw new Error(err);
    });
};
