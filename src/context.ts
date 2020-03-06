import Telegraf, { AdminPermissions } from 'telegraf';
import R from 'ramda';
import { randomInt } from '@frontendmonster/utils';
import { store, Store, Settings, User, Url, Group } from './store';
import { giphy } from './utils';

interface Gif {
  gifs: string[];
  caption: string;
}

export class Context extends Telegraf.Context {
  gifs: { unAuthorized: Gif; start: Gif; bye: Gif } = {
    unAuthorized: {
      caption: 'Nice try.',
      gifs: R.map(giphy)([
        '3oKIPoNWeba1c7SwVO',
        'l4FGmK2Q4vvrhbHMs',
        '3oKIPi568Yda66LKFO',
        'l1J3FyoyccFtHIDPq',
        '26n6Vbd1DddoiRRsI',
        '26n6zwaXtOZkfgTJe',
      ]),
    },
    start: {
      caption: "I'm ready.",
      gifs: [giphy('SiLTFKBGakjn2r7Hcp')],
    },
    bye: {
      caption: 'Bye.',
      gifs: R.map(giphy)(['MZcLsjyAASdcuf5m2G', '26n6JS4kltXRCw1kA']),
    },
  };

  public db: Store = store;
  public settings: Settings;
  public user: User;
  public groups: Group[];
  public logger: Console = console;

  getGroupLink(): string | Promise<string> {
    return this.chat.username
      ? `https://t.me/${this.chat.username.toLowerCase()}`
      : this.exportChatInviteLink().catch(() => '');
  }

  getTokens({ caseSensitive = false }: { caseSensitive?: boolean } = {}): string[] {
    const tokens = this.message?.text?.split(' ');
    if (!tokens || tokens?.length === 0) {
      return [];
    }

    return caseSensitive ? tokens : tokens.map(s => s.toLowerCase());
  }

  get isSuperUser() {
    return this.from.id === parseInt(process.env.SUPER_USER_ID, 10);
  }

  get isGroup() {
    return this.chat.type === 'supergroup' || this.chat.type === 'group';
  }

  replyWithRandomGif(gif: Gif) {
    this.replyWithVideo(gif.gifs[randomInt({ max: gif.gifs.length })], {
      caption: gif.caption,
      reply_to_message_id: this.message.message_id,
    });
  }

  async isTrustedUrl(url: string) {
    const urls = await this.db.urls.find<Url>({ status: 'trusted' });
    return urls.some(u => RegExp(u.pattern).test(url));
  }

  async isForbiddenUrl(url: string) {
    const urls = await this.db.urls.find<Url>({ status: 'forbidden' });
    return urls.some(u => RegExp(u.pattern).test(url));
  }

  get isAdmin() {
    return this.isSuperUser || this.user.status === 'admin';
  }

  async can(action: AdminPermissions) {
    const admins = await this.telegram.getChatAdministrators(this.chat.id);
    return admins
      .filter(admin => admin.status === 'creator' || admin[action])
      .some(admin => admin.user.id === this.from.id);
  }

  isHashtag(text: string) {
    return text?.startsWith('#') ?? false;
  }

  getHashtag(text: string) {
    return text?.split(' ')[0].substring(1);
  }

  log(...args: any) {
    this.logger.log('-------------------------');
    this.logger.log(...args);
    this.logger.log('-------------------------');
  }

  report(...args: any) {
    this.logger.log('-------------------------');
    this.logger.log();
    this.logger.log(...args);
    this.logger.log();
    this.logger.log('-------------------------');
  }
}
