import { Middleware } from 'telegraf';
import { Context } from '../../context';
import { Note } from '../../store/note';

const replayNote = (ctx: Context, title: string, from: number, reply: number) =>
  ctx.db.notes
    .findOne<Note>({ title })
    .then((res: Note) => {
      if (!res) {
        ctx.reply(`${title} doesn't exist`, { reply_to_message_id: from });
        return;
      }

      ctx.reply(res.note, { reply_to_message_id: reply });
    });

export const getNote: Middleware<Context> = async ctx => {
  const { message } = ctx;
  const messageID = message.reply_to_message?.message_id || message.message_id;

  const title = message.text.split(' ')[1];
  if (!title) {
    return;
  }

  await replayNote(ctx, title, message.message_id, messageID);
};

export const hashtag: Middleware<Context> = async (ctx, next) => {
  const { message } = ctx;

  if (!ctx.isHashtag(message.text)) {
    next();
    return;
  }

  const messageID = message.reply_to_message?.message_id || message.message_id;
  const title = ctx.getHashtag(message.text);

  await replayNote(ctx, title, message.message_id, messageID);
};
