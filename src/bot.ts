import Telegraf from 'telegraf';
import { BotContext, Context } from './context';
import { BotConfig } from './config';

export function Bot({ token, name }: BotConfig) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const bot = new Telegraf<BotConfig>(token, { username: name, contextType: BotContext }) as Telegraf<Context>;

  bot.start(ctx => ctx.reply('Yay! Welcome. 🎉'));
  bot.help(ctx => ctx.reply('I need help too :P'));
  bot.on('sticker', ctx => ctx.reply('WTF is that?'));

  return bot;
}
