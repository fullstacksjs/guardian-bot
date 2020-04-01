import { Middleware } from 'telegraf-ts';
import { Context } from '../../context';
import md from '../../utils/md';

const removeHandler: Middleware<Context> = async ctx => {
  const { message } = ctx;
  const messageID = message.message_id;

  const [, title] = ctx.getTokens();

  if (!title) {
    return ctx.reply('Usage: `/remove <title>`');
  }

  const count = await ctx.db.notes.remove({ title }, {});

  if (count === 0) {
    return ctx.replyWithMarkdown(`⚠ Note ${md.code(title)} not fonud`, {
      reply_to_message_id: messageID,
    });
  }

  return ctx.replyWithMarkdown(`✅ Note ${md.code(title)} Removed`, {
    reply_to_message_id: messageID,
  });
};

export default removeHandler;
