import { Middleware } from 'telegraf';
import { Context } from '../context';

const codeShot: Middleware<Context> = ctx => {
  console.log(ctx.message.entities);
};

export { codeShot };
