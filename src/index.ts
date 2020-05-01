import { config } from './config';
import { Bot } from './bot';
import { Server } from './server';

config.logger.log(`⚠️ : NODE_ENV: ${process.env.NODE_ENV}`);

const bot = Bot(config);
const server = Server(bot);

server
  .lunch()
  .then(() => {
    config.logger.log('🤖: Bot started');
  })
  .catch(config.logger.error);

process.on('unhandledRejection', config.logger.error);
