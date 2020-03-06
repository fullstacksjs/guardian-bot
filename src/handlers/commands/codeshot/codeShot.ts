import path from 'path';
import fs from 'fs';
import { Middleware } from 'telegraf';
import puppeteer from 'puppeteer-core';
import hljs from 'highlight.js';
import prettier from 'prettier';
import chrome from 'chrome-aws-lambda';
import { Context } from '../../../context';
import { isPre, resolveModule, getEntityText, isNullOrEmpty } from '../../../utils';
import { Language } from '../../../store';

export const getThemeSlug = (name: string) =>
  name
    .split(' ')
    .map(word => word.toLowerCase())
    .join('-');

const getHtml = (code: string) => `
<html lang="en">
  <head>
    <style>
    :root {
      --bg: #2b303b;
      --fg: 97a2b8;
      --br: 8px;
      --py: 60px;
      --px: 20px;
      --ed-py: 30px;
      --ed-px: 30px;
      --shadow: 0 10px 16px rgba(0, 0, 0, 0.2);
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      display: flex;
    }

    ::-webkit-scrollbar {
      display: none;
    }

    #code {
      white-space: pre-wrap;
      font-size: 12pt;
      font-family: monospace;
      border-radius: var(--br);
      padding: var(--ed-py) var(--ed-px);
      box-shadow: var(--shadow);
    }

    #container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: var(--py) var(--px);
      width: 100vw;
      background-color: var(--bg);
      position: relative;
    }

    .editor {
      max-width: 700px;
    }

    .footer {
      color: var(--fg);
      position: absolute;
      bottom: 25px;
      font-family: Rajdhani;
      opacity: 0.8;
    }
    </style>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body>
    <main id="container">
      <pre class="editor"><code class="hljs" id="code">${code}</code></pre>
      <footer class="footer">@full_stacks</footer>
    </main>
  </body>
</html>`;

async function getShot(html: string, id: string) {
  const config =
    process.env.NODE_ENV === 'production'
      ? {
          args: chrome.args,
          executablePath: await chrome.executablePath,
          headless: chrome.headless,
        }
      : { executablePath: '/usr/bin/chromium' };
  const browser = await puppeteer.launch(config);
  const page = await browser.newPage();
  await page.setContent(html);

  await page.addStyleTag({
    path: resolveModule('highlight.js/styles/nord.css'),
  });
  const container = await page.$('#container');
  const clip = await page.evaluate(el => {
    const { height, width } = el.getBoundingClientRect();
    return { height, width };
  }, container);

  await page.setViewport({
    width: clip.width,
    height: clip.height,
  });

  const dest = `${path.resolve(process.cwd(), 'data', id)}.jpeg`;
  await page.screenshot({ path: dest, quality: 100 });

  await browser.close();
  return dest;
}

const getHljsLanguage = async (code: Code, langStore: Datastore): Promise<Code> => {
  if (code?.language == null) {
    return Promise.resolve(code);
  }

  const hljsLangs = hljs.listLanguages();

  if (hljsLangs.includes(code.language)) {
    return Promise.resolve(code);
  }

  const language = await langStore.findOne<Language>({ alias: code.language });

  if (language == null) {
    return { code: `${code.language}${code.code}` };
  }

  return { ...code, language: language.language };
};

const getInputLanguage = (code: string): Code => {
  const parsed = code.match(/^(\w+)\b(.*)/s);

  if (!parsed || parsed.length < 3) {
    return { code };
  }

  return { code: parsed[2], language: parsed[1] };
};

const format = (code: Code): Code => {
  try {
    return { ...code, code: prettier.format(code.code) };
  } catch {
    return code;
  }
};

interface Code {
  code: string;
  language?: string;
}

const trim = (code: Code) => ({ ...code, code: code.code.trim() });
const highlight = ({ code, language }: Code) => (language ? hljs.highlight(language, code) : hljs.highlightAuto(code));

const codeShot: Middleware<Context> = async (ctx, next) => {
  const message = ctx.message?.reply_to_message;

  const pres = message?.entities?.filter(ent => isPre(ent));
  if (isNullOrEmpty(pres)) return next();

  const codes = await Promise.all(
    pres
      .map(pre => getEntityText(message.text, pre))
      .map(pre => getInputLanguage(pre))
      .map(code => format(code))
      .map(code => getHljsLanguage(code, ctx.db.languages)),
  );

  const highlights = codes.map(code => highlight(trim(code)));
  const templates = highlights.map(hl => getHtml(hl.value));
  const shots = await Promise.all(templates.map((template, index) => getShot(template, `${ctx.from.id}-${index}`)));

  await ctx.replyWithMediaGroup(
    shots.map(shot => ({
      type: 'photo',
      media: { source: fs.createReadStream(shot) },
    })),
  );

  shots.forEach(shot => {
    fs.promises.unlink(shot);
  });
};

export { codeShot };
