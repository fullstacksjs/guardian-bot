import Telegraf from 'telegraf';
import { BotContext, Context } from './context';
import { BotConfig } from './config';
import { User } from './store';

export function Bot({ token, name }: BotConfig) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const bot = new Telegraf<BotConfig>(token, { username: name, contextType: BotContext }) as Telegraf<Context>;

  bot.start(ctx => ctx.reply('Yay! Welcome. 🎉'));
  bot.help(ctx => ctx.reply('I need help too :P'));

  // Test databse
  bot.on('message', async ctx => {
    try {
      const result = await ctx.db.users.insert<User>({
        id: ctx.message.text,
      });

      ctx.reply(`New user create\nId: ${result.id}`);
    } catch (e) {
      if (e.errorType) {
        ctx.reply(`The user ${ctx.message.text} already exists.`);
        return;
      }

      ctx.log(e);
    }
  });
  bot.on('sticker', ctx => ctx.reply('WTF is that?'));

  return bot;
}
