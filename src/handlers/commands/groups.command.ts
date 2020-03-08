import { Middleware } from 'telegraf';
import dedent from 'dedent';
import { Context } from '../../context';
import md from '../../utils/md';
import { getGroupname } from '../../utils';

const groupsHandler: Middleware<Context> = (ctx, next) => {
  const { groups } = ctx;

  if (!groups.length) {
    ctx.reply(`No managed groups found`, { reply_to_message_id: ctx.message.message_id });
    return;
  }

  const groupNames = md.list(
    groups.map(gp => getGroupname(gp)),
    { map: md.code },
  );

  ctx.replyWithMarkdown(dedent`ℹ️ ${md.bold`Groups I manage:`}\n\n${groupNames}`, {
    reply_to_message_id: ctx.message.message_id,
  });
};

export default groupsHandler;
