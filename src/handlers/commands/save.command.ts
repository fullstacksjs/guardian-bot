import { Middleware } from 'telegraf-ts';
import { Context } from '../../context';
import { Note } from '../../store/note';

const saveHandler: Middleware<Context> = async ctx => {
  const { message } = ctx;
  const messageId = message.message_id;

  const [, title] = ctx.getTokens();
  const text = message?.reply_to_message?.text;

  if (!text || !title) {
    return ctx.replyWithMarkdown(
      'Hold on, Let me show you how to use this command: \n`reply /save <title>` on a message',
    );
  }

  const note = await ctx.db.notes.findOne<Note>({ title });
  if (note) {
    return ctx.replyWithMarkdown(`Note **${title}** already existed.`, { reply_to_message_id: messageId });
  }

  const newNote = await ctx.db.notes.insert<Note>({ title, note: text });
  return ctx.replyWithMarkdown(`Saved note **${newNote.title}**`, { reply_to_message_id: messageId });
};

export default saveHandler;
