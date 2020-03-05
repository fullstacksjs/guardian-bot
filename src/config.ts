export const config: BotConfig = {
  token: process.env.BOT_TOKEN,
  name: process.env.BOT_NAME,
  domain: process.env.BOT_DOMAIN || process.env.NOW_URL,
  port: Number.parseInt(process.env.PORT, 10),
  host: process.env.HOST,
  hookPath: process.env.HOOK_PATH,
  logger: console,
};

export interface Logger {
  log(...args: any): void;
  warn(...args: any): void;
  error(...args: any): void;
}

export interface BotConfig {
  token: string;
  name: string;
  port: number;
  host: string;
  domain: string;
  hookPath: string;
  logger: Logger;
}
