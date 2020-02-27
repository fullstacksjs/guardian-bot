import { Middleware } from 'telegraf';
import { Context } from '../../context';

export const getAll: Middleware<Context> = ctx => {
  const { message } = ctx;
  const messageID = message.message_id;

  ctx.db.notes
    .find({})
    .then(res => {
      if (res.length <= 0) {
        return ctx.reply('There is no note', { reply_to_message_id: messageID });
      }

      const notes = res.map(note => note.title);
      ctx.reply(`List of notes:\n- ${notes.join('\n- ')}`, { reply_to_message_id: messageID });
    })
    .catch(err => {
      throw new Error(err);
    });
};
