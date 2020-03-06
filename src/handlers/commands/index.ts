import { Composer } from 'telegraf';
import { Context } from '../../context';
import { codeshot } from './codeshot';
import { languages } from './languages';
import { notes } from './notes';
import groupsHandler from './groups.command';
import unban from './unban.command';

const commands = new Composer<Context>();

commands.command('groups', groupsHandler);
commands.command('unban', unban);

commands.use(languages, notes, codeshot);

export default commands;
