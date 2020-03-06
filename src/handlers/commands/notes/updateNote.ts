import { Middleware } from 'telegraf';
import { Context } from '../../../context';
import { Note } from '../../../store/note';

export const update: Middleware<Context> = ctx => {
  const { message } = ctx;
  const messageID = message.message_id;

  const [, title] = ctx.getTokens();
  const text = message?.reply_to_message?.text;

  if (!text || !title) {
    ctx.replyWithMarkdown('Hold on, Let me show you how to use this command: \n`reply /update <title>` on a message');
    return;
  }

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
