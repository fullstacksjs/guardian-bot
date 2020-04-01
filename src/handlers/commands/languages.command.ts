import { Middleware } from 'telegraf-ts';
import hljs from 'highlight.js';
import { Context } from '../../context';
import md from '../../utils/md';

const languagesHandler: Middleware<Context> = ctx => {
  return ctx.replyWithMarkdown(`${md.pre(md.list(hljs.listLanguages()))}`);
};

export default languagesHandler;
