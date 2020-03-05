import { Composer } from 'telegraf';
import { Context } from '../../context';
import { createAlias } from './createAlias';
import { languagesHandler } from './listLanguage';
import { listAliases } from './listAliases';

const languages = new Composer<Context>();

languages.command('languages', languagesHandler);
languages.command('alias', createAlias);
languages.command('aliases', listAliases);

export { languages };
