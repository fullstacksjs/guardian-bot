import fs from 'fs';
import https from 'https';
import express from 'express';
import { config } from './config';
import { Bot } from './bot';

const webhook =
  typeof (config.domain || config.hookPath) === 'string'
    ? {
        domain: config.domain,
        hookPath: config.hookPath,
        port: config.port,
        host: config.host,
      }
    : null;

config.logger.log(`⚠️ : NODE_ENV: ${process.env.NODE_ENV}`);

console.log(webhook);

const bot = Bot(config);
bot.catch((err: Error) => config.logger.error('🤖: Unhandled error', err));

const app = express();

if (!fs.existsSync(config.staticPath)) {
  fs.mkdirSync(config.staticPath);
}

app.use(express.static(config.staticPath));
app.use(bot.webhookCallback(config.hookPath));
void bot.telegram.setWebhook(
  `https://${config.host}:${config.port}/${config.hookPath}`,
);

const server = https.createServer({ key: config.key, cert: config.cert }, app);
server.listen(config.port, config.host, () =>
  config.logger.log('🤖: Bot started'),
);

// bot
//   .launch({ webhook })
//   .then(() => config.logger.log(`🤖: Bot started`))
//   .catch(config.logger.error);

process.on('unhandledRejection', config.logger.error);
