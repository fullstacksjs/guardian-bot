import { Middleware } from 'telegraf';
import { Context } from '../../context';
import { Note } from '../../store/note';

const updateHandler: Middleware<Context> = async ctx => {
  const { message } = ctx;
  const messageID = message.message_id;

  const [, title] = ctx.getTokens();
  const text = message?.reply_to_message?.text;

  if (!text || !title) {
    ctx.replyWithMarkdown('Hold on, Let me show you how to use this command: \n`reply /update <title>` on a message');
    return;
  }

  const note = await ctx.db.notes.findOne<Note>({ title });

  if (!note) {
    ctx.reply(`${title} doesn't exists`, { reply_to_message_id: messageID });
    return;
  }

  const newNote = await ctx.db.notes.update<Note>({ title }, { $set: { note: text } }, { returnUpdatedDocs: true });
  ctx.reply(`Updated note ${newNote.title}`, { reply_to_message_id: messageID });
};

export default updateHandler;
