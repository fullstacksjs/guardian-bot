import { Middleware } from 'telegraf-ts';
import dedent from 'dedent';
import { Context } from '../../context';
import md from '../../utils/md';
import { getGroupname } from '../../utils';

const groupsHandler: Middleware<Context> = ctx => {
  const { groups } = ctx;

  if (!groups.length) {
    return ctx.reply(`No managed groups found`, { reply_to_message_id: ctx.message.message_id });
  }

  const groupNames = md.list(groups.map(gp => getGroupname(gp)));

  return ctx.replyWithMarkdown(dedent`ℹ️ ${md.bold`Groups I manage:`}\n\n${groupNames}`, {
    reply_to_message_id: ctx.message.message_id,
  });
};

export default groupsHandler;
