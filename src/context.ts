import Telegraf from 'telegraf';
import { store, Store } from './store';

export class Context extends Telegraf.Context {
  public db: Store = store;

  log(...args: any) {
    console.log(...args);
  }
}
