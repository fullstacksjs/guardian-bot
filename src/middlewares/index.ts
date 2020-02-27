import { Composer } from 'telegraf';
import { Context } from '../context';
import { codeShot } from './codeShot';
import { notes } from './notes';

const middlewares = new Composer<Context>();

middlewares.use(codeShot, notes);

export { middlewares };
