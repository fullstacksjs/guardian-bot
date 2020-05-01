import Telegraf from 'telegraf-ts';
import { Context } from './context';
import { BotConfig } from './config';
import middlewares from './handlers/middlewares';
import commands from './handlers/commands';
import { monkeyPatch, syncSuperuser } from './utils/telegraf';
import inline from './handlers/inline.handler';

export function Bot({ token }: BotConfig) {
  const bot = new Telegraf<Context>(token, {
    contextType: Context,
    telegram: { webhookReply: false },
  });

  void syncSuperuser();

  bot.use(monkeyPatch);
  bot.use(middlewares);
  bot.use(commands);
  bot.use(inline);

  bot.catch((err: any, ctx) => {
    void ctx.report(err);
  });

  return bot;
}
