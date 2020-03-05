import Telegraf from 'telegraf';
import { ChatMember } from 'telegram-typings';
import { store, Store } from './store';

type Actions = keyof Omit<ChatMember, 'user' | 'status'>;

export class Context extends Telegraf.Context {
  public db: Store = store;
  public logger: Console = console;

  async can(id: number, action: Actions) {
    const admins = await this.telegram.getChatAdministrators(this.chat.id);
    return admins.filter(admin => admin.status === 'creator' || admin[action]).some(admin => admin.user.id === id);
  }

  isHashtag(text: string) {
    return text?.startsWith('#') ?? false;
  }

  getHashtag(text: string) {
    return text?.split(' ')[0].substring(1);
  }

  log(...args: any) {
    this.logger.log('-------------------------');
    this.logger.log();
    this.logger.log(...args);
    this.logger.log();
    this.logger.log('-------------------------');
  }
}
