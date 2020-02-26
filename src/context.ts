import Telegraf, { ContextMessageUpdate } from 'telegraf';
import { createStore, Store } from './store';

export interface Context extends ContextMessageUpdate {
  db: Store;
  log: any;
}

// Telegraf.Context is not defined.
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export class BotContext extends Telegraf.Context implements Context {
  public db: Store = createStore();

  log(...args: any) {
    console.log(...args);
  }
}
