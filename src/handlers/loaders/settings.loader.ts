import { Middleware } from 'telegraf';
import { Context } from '../../context';
import { Settings } from '../../store';
import { findOrCreate } from '../../utils';

const settingsLoader: Middleware<Context> = async (ctx, next) => {
  const settings = await findOrCreate<Settings>(
    ctx.db.settings,
    { chatId: ctx.chat.id },
    { chatId: ctx.chat.id, allowLinks: true },
  );

  ctx.settings = settings;

  next();
};

export default settingsLoader;
