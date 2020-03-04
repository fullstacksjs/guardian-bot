import { Composer } from 'telegraf';
import { Context } from '../../context';
import { themesHandler } from './themes';
import { codeShot } from './codeShot';

const codeshot = new Composer<Context>();
codeshot.command('themes', themesHandler);
codeshot.command('shot', codeShot);

export { codeshot };
