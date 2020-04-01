/* eslint-disable no-console */
import { Bot } from './bot';
import { config } from './config';

const bot = Bot(config);
const webhook =
  typeof (config.domain || config.hookPath) === 'string'
    ? {
        domain: config.domain,
        hookPath: config.hookPath,
        port: config.port,
        host: config.host,
      }
    : null;

bot.catch((err: Error) => config.logger.error('🤖: Unhandled error', err));
bot
  .launch({ webhook })
  .then(() =>
    config.logger.log(`NODE_ENV: ${process.env.NODE_ENV}\n🤖: Bot started`),
  )
  .catch(console.error);

process.on('unhandledRejection', console.error);
