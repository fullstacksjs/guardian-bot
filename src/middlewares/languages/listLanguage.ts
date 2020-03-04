import { Middleware } from 'telegraf';
import hljs from 'highlight.js';
import { Context } from '../../context';

const languagesHandler: Middleware<Context> = ctx => {
  ctx.replyWithMarkdown(`\`\`\`${hljs.listLanguages().join(', ')}\`\`\``);
};

export { languagesHandler };
