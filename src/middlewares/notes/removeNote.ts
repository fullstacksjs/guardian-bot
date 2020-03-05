import { Middleware } from 'telegraf';
import { Context } from '../../context';

export const remove: Middleware<Context> = ctx => {
  const { message } = ctx;
  const messageID = message.message_id;

  const title = message.text.split(' ')[1]?.toLowerCase();

  if (!title) {
    ctx.reply('Usage: `/remove <title>`');
    return;
  }

  ctx.db.notes
    .findOne({ title })
    .then(res => {
      if (!res) {
        throw Error('NotFound');
      }

      return ctx.db.notes.remove({ title }, {});
    })
    .then(() => {
      ctx.reply(`Removed note ${title}`, { reply_to_message_id: messageID });
    })
    .catch((err: Error) => {
      if (err.message === 'NotFound') {
        ctx.reply(`There is no **${title}** note here. Ah, Humans are so forgetful`, {
          reply_to_message_id: messageID,
        });

        return;
      }
      throw err;
    });
};
