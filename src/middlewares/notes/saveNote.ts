import { Middleware } from 'telegraf';
import { Context } from '../../context';
import { Note } from '../../store/note';

export const saveNote: Middleware<Context> = ctx => {
  const { message } = ctx;
  const messageID = message.message_id;

  const title = message.text?.split(' ')[1]?.toLowerCase();

  if (!message.reply_to_message || !title) {
    ctx.replyWithMarkdown('Hold on, Let me show you how to use this command: \n`reply /save <title>` on a message');
    return;
  }

  const text = message.reply_to_message.text;

  ctx.db.notes
    .findOne<Note>({ title })
    .then(note => {
      if (note) {
        throw Error('AlreadyExisted');
      }

      return ctx.db.notes.insert<Note>({ title, note: text });
    })
    .then(note => {
      ctx.replyWithMarkdown(`Saved note **${note.title}**`, { reply_to_message_id: messageID });
    })
    .catch((err: Error) => {
      if (err.message === 'AlreadyExisted') {
        ctx.replyWithMarkdown(`Note **${title}** already existed.`, { reply_to_message_id: messageID });
        return;
      }

      throw err;
    });
};
