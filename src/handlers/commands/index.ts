import { Composer } from 'telegraf-ts';
import { Context } from '../../context';
import languageLoader from '../loaders/language.loader';
import aliasesHandler from './aliases.command';
import aliasHandler from './alias.command';
import delHandler from './del.command';
import getHandler from './get.command';
import groupsHandler from './groups.command';
import hashtagHandler from './hashtag.command';
import languagesHandler from './languages.command';
import notesHandler from './notes.command';
import removeHandler from './remove.command';
import saveHandler from './save.command';
import shotHandler from './shot.command';
import themesHandler from './themes.command';
import unbanHandler from './unban.command';
import updateHandler from './update.command';
import syncHandler from './sync.command';

const commands = new Composer<Context>();

commands.command('alias', aliasHandler);
commands.command('aliases', aliasesHandler);
commands.command('del', delHandler);
commands.command('get', getHandler);
commands.command('groups', groupsHandler);
commands.command('languages', languagesHandler);
commands.command('shot', languageLoader, shotHandler);
commands.command('save', saveHandler);
commands.command('notes', notesHandler);
commands.command('themes', themesHandler);
commands.command('unban', unbanHandler);
commands.command('update', updateHandler);
commands.command('remove', removeHandler);
commands.command('sync', syncHandler);
commands.hashtag(/.*/, hashtagHandler);

export default commands;
