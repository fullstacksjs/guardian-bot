import { Composer } from 'telegraf';
import { Context } from '../context';
import { codeShot } from './codeShot';

const middlewares = new Composer<Context>();

middlewares.use(codeShot);

export { middlewares };
