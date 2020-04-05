import path from 'path';
import hljs from 'highlight.js';
import puppeteer from 'puppeteer-core';
import prettier, { BuiltInParserName } from 'prettier';
import { randomInt } from '@frontendmonster/utils';
import R from 'ramda';
import prettierConfig from '../assets/prettier';

export interface Code {
  value: string;
  language?: string;
  parser?: BuiltInParserName;
  filename?: string;
  raw?: boolean;
  html?: string;
}

const resolveOutput = (name: string) =>
  `${path.resolve(process.cwd(), 'data', name)}.jpeg`;

const getHtml = (code: Code): Code => {
  const html = `
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body>
    <main id="container">
      <pre class="editor" data-title="${code.filename || code.language}">
        <code class="hljs">${code.value}</code>
      </pre>
      <footer class="footer">Join us: @fullstacks</footer>
    </main>
  </body>
</html>`;
  return {
    ...code,
    html,
  };
};

async function takeScreenshot(code: Code): Promise<string> {
  const config = {
    executablePath: process.env.CHROMIUM_PATH,
    args: ['--no-sandbox'],
  };

  const browser = await puppeteer.launch(config);
  const page = await browser.newPage();
  await page.setContent(code.html);
  await page.addStyleTag({
    path: path.resolve(__dirname, '../assets/theme.css'),
  });
  const container = await page.$('#container');

  const clip = await page.evaluate(el => {
    const { height, width } = el.getBoundingClientRect();
    return { height, width };
  }, container);

  await page.setViewport({
    width: Number(clip.width),
    height: Number(clip.height),
  });

  const dest = resolveOutput(code.filename + randomInt());
  await page.screenshot({ path: dest, quality: 100 });

  await browser.close();
  return dest;
}

const format = (code: Code): Code => {
  if (code.raw) return code;

  try {
    return {
      ...code,
      value: prettier.format(code.value, {
        parser: code.parser,
        ...prettierConfig,
      }),
    };
  } catch {
    return code;
  }
};

const highlight = (code: Code): Code => {
  const hl = code.language
    ? hljs.highlight(code.language, code.value)
    : hljs.highlightAuto(code.value);

  return {
    ...code,
    language: hl.language,
    value: hl.value,
  };
};

export const getShot = R.pipe(format, highlight, getHtml, takeScreenshot);
