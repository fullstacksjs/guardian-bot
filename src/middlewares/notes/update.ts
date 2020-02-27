import { Middleware } from 'telegraf';
import { Context } from '../../context';

export const update: Middleware<Context> = ctx => {
  const { message } = ctx;
  const messageID = message.message_id;

  if (!message.reply_to_message || message.text.split(' ').length < 2) {
    return;
  }

  const note = message.reply_to_message.text;
  const noteTitle = message.text.split(' ')[1].toLowerCase();

  ctx.db.notes
    .findOne({ title: noteTitle })
    .then(res => {
      if (!res) {
        ctx.reply(`${noteTitle} doesn't exists`, { reply_to_message_id: messageID });
      }
      ctx.db.notes
        .update({ title: noteTitle }, { $set: { note } })
        .then(res => {
          ctx.reply(`Updated note ${noteTitle}`, { reply_to_message_id: messageID });
        })
        .catch(err => {
          throw new Error(err);
        });
    })
    .catch(err => {
      throw new Error(err);
    });
};
