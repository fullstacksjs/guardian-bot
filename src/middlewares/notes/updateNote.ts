import { Middleware } from 'telegraf';
import { Context } from '../../context';
import { Note } from '../../store/note';

export const update: Middleware<Context> = ctx => {
  const { message } = ctx;
  const messageID = message.message_id;

  if (!message.reply_to_message || message.text.split(' ').length < 2) {
    return;
  }

  const text = message.reply_to_message.text;
  const title = message.text.split(' ')[1].toLowerCase();

  ctx.db.notes
    .findOne<Note>({ title })
    .then(note => {
      if (!note) {
        throw Error('NotFound');
      }

      return ctx.db.notes.update<Note>({ title }, { $set: { note: text } }, { returnUpdatedDocs: true });
    })
    .then(note => {
      ctx.reply(`Updated note ${note.title}`, { reply_to_message_id: messageID });
    })
    .catch((err: Error) => {
      if (err.message === 'NotFound') {
        ctx.reply(`${title} doesn't exists`, { reply_to_message_id: messageID });
        return;
      }

      throw err;
    });
};
