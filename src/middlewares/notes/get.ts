import { Middleware } from 'telegraf';
import { Context } from '../../context';

export const command: Middleware<Context> = ctx => {
  const { message } = ctx;
  const messageID = message.reply_to_message?.message_id || message.message_id;

  if (message.text.split(' ').length < 2) {
    return;
  }

  const noteTitle = message.text.split(' ')[1].toLowerCase();

  ctx.db.notes
    .findOne({ title: noteTitle })
    .then(res => {
      if (!res) {
        return ctx.reply(`${noteTitle} doesn't exist`, { reply_to_message_id: message.message_id });
      }

      ctx.reply(res.note, { reply_to_message_id: messageID });
    })
    .catch(err => {
      throw new Error(err);
    });
};

export const hashtag: Middleware<Context> = ctx => {
  const { message } = ctx;
  const messageID = message.reply_to_message?.message_id || message.message_id;
  const noteTitle = message.text.split(' ')[0].substring(1);

  ctx.db.notes
    .findOne({ title: noteTitle })
    .then(res => {
      if (res) {
        ctx.reply(res.note, { reply_to_message_id: messageID });
      }
    })
    .catch(err => {
      throw new Error(err);
    });
};
