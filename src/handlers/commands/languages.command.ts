import { Middleware } from 'this-is-a-package-for-draft-stuff-please-dont-use-this-one';
import hljs from 'highlight.js';
import { Context } from '../../context';
import md from '../../utils/md';

const languagesHandler: Middleware<Context> = ctx => {
  ctx.replyWithMarkdown(`${md.pre(md.list(hljs.listLanguages()))}`);
};

export default languagesHandler;
