import Telegraf, { ContextMessageUpdate } from 'telegraf';

export interface Context extends ContextMessageUpdate {
  log: any;
}

// Telegraf.Context is not defined.
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export class BotContext extends Telegraf.Context implements Context {
  log(...args: any) {
    console.log(...args);
  }
}
