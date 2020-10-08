import { Middleware } from 'telegraf-ts';
import { Context } from '../../context';
import { Language } from '../../store';

const languageLoader: Middleware<Context> = async (ctx, next) => {
  const [, alias] = ctx.entities;
  ctx.language = await ctx.db.languages.findOne<Language>({
    alias: alias?.content,
  });

  return next();
};

export default languageLoader;
