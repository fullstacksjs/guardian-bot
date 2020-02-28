import { Composer } from 'telegraf';
import { Context } from '../context';
import { captcha } from './captcha';
import { notes } from './notes';

const middlewares = new Composer<Context>();

middlewares.use(captcha, notes);

export { middlewares };
