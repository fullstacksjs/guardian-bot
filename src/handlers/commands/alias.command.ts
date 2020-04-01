import { Middleware } from 'telegraf-ts';
import { Context } from '../../context';
import md from '../../utils/md';
import { Language } from '../../store';
import { createOrUpdate } from '../../utils';

const aliasHandler: Middleware<Context> = async ctx => {
  const [, language, alias] = ctx.getTokens();

  if (!language || !alias) {
    return ctx.replyWithMarkdown(
      `Wrong Usage:\nexample: ${md.pre('/alias javascript js')}`,
    );
  }

  if (!ctx.isAdmin) {
    return ctx.replyWithRandomGif(ctx.gifs.unAuthorized);
  }

  await createOrUpdate<Language>(
    ctx.db.languages,
    { alias },
    { alias, language },
  );

  return ctx.replyWithMarkdown(
    `The language ${md.code(language)} has been aliased to ${md.code(alias)}`,
  );
};

export default aliasHandler;
