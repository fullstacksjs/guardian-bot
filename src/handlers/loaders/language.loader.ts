import { Middleware } from 'this-is-a-package-for-draft-stuff-please-dont-use-this-one';
import { Context } from '../../context';
import { Language } from '../../store';

const languageLoader: Middleware<Context> = async (ctx, next) => {
  const [, alias] = ctx.entities;
  ctx.language = await ctx.db.languages.findOne<Language>({ alias: alias?.content });

  next();
};

export default languageLoader;
