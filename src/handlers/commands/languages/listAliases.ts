import { Middleware } from 'telegraf';
import { Context } from '../../../context';
import * as md from '../../../utils/md';
import { Language } from '../../../store';

const listAliases: Middleware<Context> = async ctx => {
  const languages = await ctx.db.languages.find<Language>({});

  if (languages.length === 0) {
    ctx.replyWithMarkdown(`You have no alias. try to create one with\n${md.code('/alias <language> <alias>')}`);
    return;
  }

  const aliases = languages.map(alias => md.code(`${alias.alias} -> ${alias.language}`));
  ctx.replyWithMarkdown(`Aliases:\n${aliases.join('\n')}`);
};

export { listAliases };
