import { Middleware } from 'telegraf-ts';
import { Context } from '../../context';
import { Note } from '../../store/note';

const hashtagHandler: Middleware<Context> = async (ctx, next) => {
  const { message } = ctx;
  const messageId = message.reply_to_message?.message_id || message.message_id;

  const title = ctx.getHashtag(message.text);

  const note = await ctx.db.notes.findOne<Note>({ title });

  if (!note) {
    return next();
  }

  return ctx.reply(note.note, { reply_to_message_id: messageId });
};

export default hashtagHandler;
