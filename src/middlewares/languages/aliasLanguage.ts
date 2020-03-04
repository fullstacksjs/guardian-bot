import { Middleware } from 'telegraf';
import hljs from 'highlight.js';
import { Context } from '../../context';

const aliasHandler: Middleware<Context> = ctx => {
  ctx.replyWithMarkdown(`\`\`\`${hljs.listLanguages().join(', ')}\`\`\``);
};

export { aliasHandler };
