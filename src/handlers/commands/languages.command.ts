import { Middleware } from 'telegraf';
import hljs from 'highlight.js';
import { Context } from '../../context';
import md from '../../utils/md';

const languagesHandler: Middleware<Context> = ctx => {
  ctx.replyWithMarkdown(`${md.pre(md.list(hljs.listLanguages()))}`);
};

export default languagesHandler;
