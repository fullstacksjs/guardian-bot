import fs from 'fs';
import https from 'https';
import express from 'express';
import Telegraf from 'telegraf-ts';
import { config } from './config';

export function Server(bot: Telegraf<any>) {
  bot.catch((err: Error) => config.logger.error('🤖: Unhandled error', err));

  const app = express();

  if (!fs.existsSync(config.staticPath)) {
    fs.mkdirSync(config.staticPath);
  }

  app.use(express.static(config.staticPath));
  app.use(bot.webhookCallback(`/${config.hookPath}`));

  const server = https.createServer(
    { key: config.key, cert: config.cert },
    app,
  );

  return {
    lunch() {
      return new Promise((resolve, reject) => {
        server.listen(config.port, () => {
          const path = `https://${config.host}:${config.port}/${config.hookPath}`;
          bot.telegram
            .setWebhook(path)
            .then(() => resolve(config))
            .catch(reject);
        });
      });
    },
  };
}
