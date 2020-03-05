import { Middleware } from 'telegraf';
import { Context } from '../../context';
import * as md from '../../utils/md';
import { Language } from '../../store';

const createAlias: Middleware<Context> = async ctx => {
  const language = ctx.message.text.split(' ')[1]?.toLowerCase();
  const alias = ctx.message.text.split(' ')[2]?.toLowerCase();

  if (!language || !alias) {
    ctx.replyWithMarkdown(`Wrong Usage:\nexample: ${md.pre('/alias javascript js')}`);
    return;
  }

  await ctx.db.languages.insert<Language>({ alias, language });

  ctx.replyWithMarkdown(`The language ${md.code(language)} has been aliased to ${md.code(alias)}`);
};

export { createAlias };
