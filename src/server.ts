import fs from 'fs';
import http from 'http';
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

  const server = http.createServer(app);

  return {
    lunch() {
      return new Promise((resolve, reject) => {
        server.listen(8080, () => {
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
