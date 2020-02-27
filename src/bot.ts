import Telegraf from 'telegraf';
import { Context } from './context';
import { BotConfig } from './config';
import { middlewares } from './middlewares';

export function Bot({ token, name }: BotConfig) {
  const bot = new Telegraf<Context>(token, { contextType: Context });

  bot.use(middlewares);

  return bot;
}
