import { Options } from 'prettier';

const prettierConfig = {
  printWidth: 60,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  jsxBracketSameLine: false,
  proseWrap: 'always',
  arrowParens: 'avoid',
  endOfLine: 'lf',
  htmlWhitespaceSensitivity: 'css',
  insertPragma: false,
  jsxSingleQuote: false,
  quoteProps: 'consistent',
  requirePragma: false,
} as Options;

export default prettierConfig;
