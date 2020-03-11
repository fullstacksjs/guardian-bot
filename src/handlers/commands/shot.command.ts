import path from 'path';
import fs from 'fs';
import { Middleware } from 'telegraf-ts';
import puppeteer from 'puppeteer-core';
import hljs from 'highlight.js';
import prettier, { BuiltInParserName } from 'prettier';
import { Context } from '../../context';
import { isPre, isNullOrEmpty } from '../../utils';
import prettierConfig from '../../assets/prettier.json';

const getHtml = (code: string, language: string, filename: string) => `
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body>
    <main id="container">
      <pre class="editor" data-title="${filename || language}">
        <code class="hljs">${code}</code>
      </pre>
      <footer class="footer">@full_stacks</footer>
    </main>
  </body>
</html>`;

const resolveOutput = (name: string) => `${path.resolve(process.cwd(), 'data', name)}.jpeg`;

async function getShot(html: string, name: string) {
  const config = { executablePath: process.env.CHROMIUM_PATH, args: ['--no-sandbox'] };

  const browser = await puppeteer.launch(config);
  const page = await browser.newPage();
  await page.setContent(html);
  await page.addStyleTag({ path: path.resolve(__dirname, '../../assets/theme.css') });
  const container = await page.$('#container');

  const clip = await page.evaluate(el => {
    const { height, width } = el.getBoundingClientRect();
    return { height, width };
  }, container);

  await page.setViewport({ width: Number(clip.width), height: Number(clip.height) });

  const dest = resolveOutput(name);
  await page.screenshot({ path: dest, quality: 100 });

  browser.close();
  return dest;
}

const format = (code: Code): Code => {
  try {
    return {
      ...code,
      code: prettier.format(code.code, { parser: code.parser, ...(prettierConfig as prettier.Options) }),
    };
  } catch {
    return code;
  }
};

interface Code {
  code: string;
  language?: string;
  parser?: BuiltInParserName;
}

const highlight = ({ code, language }: Code) => (language ? hljs.highlight(language, code) : hljs.highlightAuto(code));

const shotHandler: Middleware<Context> = async (ctx, next) => {
  const message = ctx.message?.reply_to_message;

  const pres = message?.entities?.filter(ent => isPre(ent));

  if (isNullOrEmpty(pres)) return next();

  const getShots = pres
    .map(pre => ctx.getEntityText(pre, message.text))
    .map(pre => ({ code: pre.trim(), language: ctx.language?.language, parser: ctx.language?.parser } as Code))
    .map(code => highlight(format(code)))
    .map(hl => getHtml(hl.value, hl.language, ctx.entities[2]?.content))
    .map((template, index) => getShot(template, `${ctx.from.id}-${index}`));

  const shots = await Promise.all(getShots);

  await ctx.replyWithMediaGroup(
    shots.map(shot => ({
      type: 'photo',
      media: { source: fs.createReadStream(shot) },
    })),
  );

  shots.forEach(shot => fs.promises.unlink(shot));
};

export default shotHandler;
