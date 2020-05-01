// import fs from 'fs';
import { Middleware } from 'telegraf-ts';
import { Context } from '../../context';
import { isPre, isNullOrEmpty } from '../../utils';
import { Code, getShot } from '../../utils/shot';

const shotHandler: Middleware<Context> = async ctx => {
  const message = ctx.message?.reply_to_message;

  if (!message) {
    return ctx.replyWithMarkdown(
      '⭕️ **Wrong Usage**\nYou should reply this command on a message.\n`/shot [language] [filename]`',
      {
        reply_to_message_id: ctx.message.message_id,
      },
    );
  }

  const pres = message?.entities?.filter(ent => isPre(ent));

  if (isNullOrEmpty(pres)) {
    return ctx.replyWithMarkdown(
      "⭕️ Can't find any codeblock in your message, please wrap your code in 3 backticks (\\`\\`\\`) character and try again.",
      { reply_to_message_id: ctx.message.message_id },
    );
  }

  const codes = pres
    .map(pre => ctx.getEntityText(pre, message.text))
    .map(
      pre =>
        ({
          value: pre.trim(),
          language: ctx.language?.language,
          parser: ctx.language?.parser,
          filename: ctx.flags.get('filename'),
          raw: Boolean(ctx.flags.get('raw')),
        } as Code),
    )
    .map(code => getShot(code));

  const shots = await Promise.all(codes);

  return ctx.replyWithMediaGroup(
    shots.map(shot => ({
      type: 'photo',
      media: { source: shot },
    })),
    {
      reply_to_message_id: message.message_id,
    },
  );

  // return Promise.all(shots.map(shot => fs.promises.unlink(shot)));
};

export default shotHandler;
