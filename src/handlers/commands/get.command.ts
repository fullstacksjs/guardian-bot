import { Middleware } from 'telegraf-ts';
import { Context } from '../../context';
import { Note } from '../../store/note';

const getHandler: Middleware<Context> = async ctx => {
  const { message } = ctx;
  const messageId = message.reply_to_message?.message_id || message.message_id;

  const [, title] = ctx.getTokens();

  if (!title) {
    await ctx.replyWithMarkdown('Hold on, Let me show you how to use this command: \n`/get <title>`');
    return;
  }

  const note = await ctx.db.notes.findOne<Note>({ title });

  if (!note) {
    await ctx.reply(`${title} doesn't exist`, { reply_to_message_id: messageId });
    return;
  }

  await ctx.reply(note.title, { reply_to_message_id: messageId });
};

export default getHandler;
