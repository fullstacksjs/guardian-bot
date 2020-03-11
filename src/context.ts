import Telegraf, { AdminPermissions, MessageEntity, EntityType, Telegram, TOptions } from 'telegraf-ts';
import R from 'ramda';
import { randomInt } from '@frontendmonster/utils';
import { store, Store, Settings, User, Url, Group, Language } from './store';
import { giphy } from './utils';

interface Gif {
  gifs: string[];
  caption: string;
}

export interface ExtendedMessageEnity {
  type: EntityType | 'text';
  offset: number;
  length: number;
  content?: string;
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
      caption:
        "Hmm, I don't belong here, FullstacksGuradBot is a FOSS project.\nSo if you like me host your onw instance.",
      gifs: R.map(giphy)(['MZcLsjyAASdcuf5m2G', '26n6JS4kltXRCw1kA']),
    },
  };

  public entities: ExtendedMessageEnity[];
  public db: Store = store;
  public settings: Settings;
  public user: User;
  public groups: Group[];
  public language: Language;
  public logger: Console = console;

  constructor(update: any, telegram: Telegram, options: TOptions) {
    super(update, telegram, options);
    this.entities = this.parseCommand();
  }

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

  getEntityText(
    entity: Pick<ExtendedMessageEnity, 'offset' | 'length'>,
    message: string = this.message.text || this.message.caption,
  ) {
    return message?.substr(entity.offset, entity.length);
  }

  getUrlFromEntity(entity: MessageEntity) {
    if (entity.type === 'url') {
      return this.getEntityText(entity);
    }

    if (entity.type === 'text_link' && entity.url) {
      return entity.url;
    }

    return null;
  }

  parseCommand() {
    const extendedEntities = [];
    const { message } = this;
    const entities = message?.entities;

    if (!entities) {
      return null;
    }

    for (let cursor = 0; cursor < entities.length; cursor++) {
      const current = entities[cursor];
      const next = entities[cursor + 1];

      extendedEntities.push({ ...current, content: this.getEntityText(current) });

      const entityEnd = current.offset + current.length;
      if (entityEnd === message.text.length) {
        break;
      }

      if (next?.offset === entityEnd + 1) {
        continue;
      }

      const to = next ? next.offset : message.text.length;
      extendedEntities.push(...this.getTextEntities(entityEnd + 1, to));
    }

    return extendedEntities;
  }

  private getTextEntities(from: number, to: number) {
    const text = this.getEntityText({ offset: from, length: to - from });

    const matchs = text.matchAll(/(\S+)/g);

    const entities: ExtendedMessageEnity[] = [];

    for (const match of matchs) {
      const range = {
        offset: match.index + from,
        length: match[0].length,
      };

      entities.push({
        ...range,
        type: 'text',
        content: this.getEntityText(range),
      });
    }

    return entities;
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
