import { Composer } from 'telegraf';
import { Context } from '../../context';
import { languages } from './languages';
import { notes } from './notes';
import groupsHandler from './groups.command';
import unban from './unban.command';
import themesHandler from './themes.command';
import shotHandler from './shot.command';
import languageLoader from './language.loader';

const commands = new Composer<Context>();

commands.command('groups', groupsHandler);
commands.command('unban', unban);
commands.command('themes', themesHandler);
commands.command('shot', languageLoader, shotHandler);
commands.use(languages, notes);

export default commands;
