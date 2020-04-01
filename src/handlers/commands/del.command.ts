import { Middleware } from 'telegraf-ts';
import { Context } from '../../context';

const delHandler: Middleware<Context> = async (ctx, next) => {
  if (!ctx.isAdmin) {
    return next();
  }

  const reason = ctx.entities
    .filter(ent => ent.type === 'text')
    .map(ent => ent.content)
    .join(' ');

  if (!ctx.message.reply_to_message) {
    await ctx.replyWithMarkdown(
      "⭕️ **Wrong Usage**\nReply to a message you'd like to delete",
    );
    ctx.scheduleDeleteMessage();
    return;
  }

  await ctx.telegram.deleteMessage(
    ctx.flags.get('chat_id') || ctx.chat.id,
    Number(ctx.flags.get('msg_id')) || ctx.message.reply_to_message.message_id,
  );

  if (reason) {
    await ctx.replyWithHTML(`🗑 ${reason}`);
    ctx.scheduleDeleteMessage();
  }
};

export default delHandler;
