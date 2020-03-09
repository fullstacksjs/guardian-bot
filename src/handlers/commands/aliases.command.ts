import { Middleware } from 'this-is-a-package-for-draft-stuff-please-dont-use-this-one';
import { Context } from '../../context';
import md from '../../utils/md';
import { Language } from '../../store';

const aliasesHandler: Middleware<Context> = async ctx => {
  const languages = await ctx.db.languages.find<Language>({});

  if (!languages.length) {
    ctx.replyWithMarkdown(`You have no alias. try to create one with\n${md.code('/alias <language> <alias>')}`);
    return;
  }

  const aliases = languages.map(alias => md.code(`${alias.alias} -> ${alias.language}`));
  ctx.replyWithMarkdown(`Aliases:\n${aliases.join('\n')}`);
};

export default aliasesHandler;
