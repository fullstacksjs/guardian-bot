import { Composer } from 'telegraf';
import { Context } from '../context';
import { captcha } from './captcha';
import { notes } from './notes';
import { codeshot } from './codeshot';

const middlewares = new Composer<Context>();

middlewares.use(captcha, notes, codeshot);

export { middlewares };
