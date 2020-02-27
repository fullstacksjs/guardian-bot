import fs from 'fs';
import path from 'path';
import webshot from 'webshot';
import { Middleware } from 'telegraf';
import R from 'ramda';
import { MessageEntity } from 'telegram-typings';
import { Context } from '../context';
import { isPre, isNullOrEmpty, getEntityText } from '../utils';

export const getWebShot = (html, imagePath, webshotOptions) =>
  new Promise((resolve, reject) => {
    webshot(html, imagePath, webshotOptions, err => (err ? reject(err) : resolve(imagePath)));
  });

export const getThemeSlug = (name: string) =>
  name
    .split(' ')
    .map(word => word.toLowerCase())
    .join('-');

const getThemeCssFilePath = (theme: string) =>
  path.resolve(`/home/skill/northcamp/dev/app/fullstacks-tg-bot/node_modules/prismjs/themes/prism.css`);

const readCss = (theme: string) => fs.readFileSync(getThemeCssFilePath(theme));

const getHtml = (code: string, theme: string, lang: string) => `<html lang="en">
<head>
<style>
  ::-webkit-scrollbar {
    display: none;
  }
  ${readCss(theme)}
  #code {
    white-space: pre-wrap;
    font-size: 12pt;
    font-family: monospace;
  }
</style>
</head>
<body style="display: inline-block;">
  <pre style="max-width: 1400px">
  <pre><code class="language-css">p { color: red }</code></pre>
  </pre>
</body>
</html>`;

const codeShot: Middleware<Context> = (ctx, next) => {
  ctx.reply(Math.random() > 0.5 ? 'Toonet mizaram' : 'Dappai');

  const { message } = ctx;
  const { entities } = message;

  if (!entities) return next();

  const codes = entities.filter(ent => isPre(ent)).map(ent => getEntityText(message.text, ent));

  const html = getHtml(source.trim(), themeSlug, lang !== 'auto' && lang);
  console.log(codes);
};

export { codeShot };
