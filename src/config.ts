import path from 'path';

export const config: BotConfig = {
  token: process.env.BOT_TOKEN,
  domain: process.env.BOT_DOMAIN || process.env.NOW_URL,
  port: Number.parseInt(process.env.PORT, 10),
  host: process.env.HOST,
  hookPath: process.env.HOOK_PATH,
  logger: console,
  defaultCacheTime:
    Number.parseInt(process.env.DEFAULT_INLINE_CACHE_TIME, 10) || 500,
  staticPath: path.resolve(__dirname, '../public'),
};

export interface Logger {
  log: (...args: any) => void;
  warn: (...args: any) => void;
  error: (...args: any) => void;
}

export interface BotConfig {
  token: string;
  port: number;
  host: string;
  domain: string;
  hookPath: string;
  logger: Logger;
  defaultCacheTime: number;
  staticPath: string;
}
