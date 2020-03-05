import { Composer } from 'telegraf';
import { Context } from '../context';
import { captcha } from './captcha';
import { notes } from './notes';
import { codeshot } from './codeshot';
import { silent } from './silent';
import { languages } from './languages';

const middlewares = new Composer<Context>();

middlewares.use(silent, captcha, notes, languages, codeshot);

export { middlewares };
