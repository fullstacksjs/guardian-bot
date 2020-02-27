import Telegraf from 'telegraf';
import { createStore, Store } from './store';

export class Context extends Telegraf.Context {
  public db: Store = createStore();

  log(...args: any) {
    console.log(...args);
  }
}
