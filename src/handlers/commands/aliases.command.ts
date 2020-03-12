import { Middleware } from 'telegraf-ts';
import { Context } from '../../context';
import md from '../../utils/md';
import { Language } from '../../store';

const aliasesHandler: Middleware<Context> = async ctx => {
  const languages = await ctx.db.languages.find<Language>({
    $where() {
      return this.alias !== this.language;
    },
  });

  if (!languages.length) {
    ctx.replyWithMarkdown(`You have no alias. try to create one with\n${md.code('/alias <language> <alias>')}`);
    return;
  }

  const aliases = languages.map(l => md.code(`${l.alias} -> ${l.language}`));
  ctx.replyWithMarkdown(`**Aliases**:\n\n${aliases.join('\n')}`);
};

export default aliasesHandler;
