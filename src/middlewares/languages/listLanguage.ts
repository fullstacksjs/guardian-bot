import { Middleware } from 'telegraf';
import hljs from 'highlight.js';
import { Context } from '../../context';
import * as md from '../../utils/md';

const languagesHandler: Middleware<Context> = ctx => {
  ctx.replyWithMarkdown(`${md.pre(hljs.listLanguages().join(', '))}`);
};

export { languagesHandler };
