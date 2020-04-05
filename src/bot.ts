import Telegraf, {
  InlineQueryResultArticle,
  InlineQueryResultPhoto,
} from 'telegraf-ts';
import { Context } from './context';
import { BotConfig } from './config';
import middlewares from './handlers/middlewares';
import commands from './handlers/commands';
import { monkeyPatch } from './utils/telegraf';
import { getShot } from './utils/shot';

export function Bot({ token }: BotConfig) {
  const bot = new Telegraf<Context>(token, { contextType: Context });

  bot.use(monkeyPatch);
  bot.use(middlewares);

  bot.on('inline_query', handle);
  bot.on('chosen_inline_result', ({ log, chosenInlineResult }) => {
    log('chosen inline result', chosenInlineResult);
  });

  bot.use(commands);

  async function handle(ctx: Context): Promise<any> {
    const code = ctx.inlineQuery?.query;

    if (!code) {
      return ctx.answerInlineQuery([]);
    }

    const shouldShot = code.trim().endsWith('/shot');

    if (!shouldShot) {
      return ctx.answerInlineQuery([
        {
          id: '1',
          type: 'article',
          input_message_content: {
            message_text: 'Please replay on a message',
            parse_mode: 'html',
          },
          title: 'Put "/shot" command when you done.',
        } as InlineQueryResultArticle,
      ]);
    }

    ctx.log(code);

    const shot = await getShot({ value: code });

    return ctx.answerInlineQuery([
      {
        id: '1',
        type: 'photo',
        title: '📸 Here is your codeshot',
        photo_url: `http://149.202.16.203:7001/${shot}`,
      } as InlineQueryResultPhoto,
    ]);
  }

  bot.catch((err: any, ctx) => {
    void ctx.report(err);
  });

  return bot;
}
