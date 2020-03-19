import Telegraf from 'telegraf-ts';
import { Context } from './context';
import { BotConfig } from './config';
import middlewares from './handlers/middlewares';
import commands from './handlers/commands';
import { monkeyPatch } from './utils/telegraf';

export function Bot({ token }: BotConfig) {
  const bot = new Telegraf<Context>(token, { contextType: Context });

  bot.use(monkeyPatch);
  bot.use(middlewares);
  bot.use(commands);

  bot.catch((err: any, ctx) => {
    ctx.report(err);
  });

  return bot;
}