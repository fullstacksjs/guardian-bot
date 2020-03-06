import { Middleware } from 'telegraf';
import { Context } from '../../../context';
import * as md from '../../../utils/md';
import { Language } from '../../../store';
import { createOrUpdate } from '../../../utils';

const createAlias: Middleware<Context> = async ctx => {
  const [, language, alias] = ctx.getTokens();

  if (!language || !alias) {
    ctx.replyWithMarkdown(`Wrong Usage:\nexample: ${md.pre('/alias javascript js')}`);
    return;
  }

  if (!ctx.isAdmin) {
    ctx.replyWithRandomGif(ctx.gifs.unAuthorized);
    return;
  }

  await createOrUpdate<Language>(ctx.db.languages, { alias }, { alias, language });

  ctx.replyWithMarkdown(`The language ${md.code(language)} has been aliased to ${md.code(alias)}`);
};

export { createAlias };
