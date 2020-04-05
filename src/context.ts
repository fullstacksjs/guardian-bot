import { randomInt } from '@frontendmonster/utils';
import R from 'ramda';
import Telegraf, {
  AdminPermissions,
  MessageEntity,
  EntityType,
  Telegram,
  TOptions,
} from 'telegraf-ts';
import { store, Store, Settings, User, Url, Group, Language } from './store';
import { giphy, flagRegex, extractFlags } from './utils';

interface Gif {
  gifs: string[];
  caption: string;
}

export interface ExtendedMessageEnity {
  type: EntityType | 'text' | 'flag';
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
        "Hmm, I don't belong here, FullstacksGuradBot is a FOSS project.\nSo if you like me host your own instance.",
      gifs: R.map(giphy)(['MZcLsjyAASdcuf5m2G', '26n6JS4kltXRCw1kA']),
    },
  };

  public entities: ExtendedMessageEnity[];
  public flags: Map<string, string>;
  public db: Store = store;
  public settings: Settings;
  public user: User;
  public groups: Group[];
  public language: Language;
  public logger: Console = console;

  constructor(update: any, telegram: Telegram, options: TOptions) {
    super(update, telegram, options);
    const parsed = this.parseEntites();
    this.entities = parsed.entities;
    this.flags = parsed.flags;
  }

  getGroupLink(): string | Promise<string> {
    return this.chat.username
      ? `https://t.me/${this.chat.username.toLowerCase()}`
      : this.exportChatInviteLink().catch(() => '');
  }

  getTokens({
    caseSensitive = false,
  }: { caseSensitive?: boolean } = {}): string[] {
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
    return this.chat?.type === 'supergroup' || this.chat?.type === 'group';
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

  scheduleDeleteMessage(timeout?: number) {
    setTimeout(
      () => this.deleteMessage,
      timeout ?? this.settings.deleteDelay ?? 1000,
    );
  }

  parseEntites() {
    const { message } = this;
    if (!message?.text) {
      return {};
    }

    const entities: ExtendedMessageEnity[] = message?.entities || [];

    const firstTextEntities =
      entities[0] == null || entities[0]?.offset > 0
        ? this.extractTextEntities(
            0,
            entities[0] ? entities[0].offset : message.text.length,
          )
        : [];

    const followEntities = entities.reduce<ExtendedMessageEnity[]>(
      (acc, ent, index) => {
        const next = entities[index + 1];
        const entityEnd = ent.offset + ent.length;
        const needToParse = next?.offset !== entityEnd + 1;

        const textEntities = needToParse
          ? this.extractTextEntities(
              entityEnd + 1,
              next ? next.offset : message.text.length,
            )
          : [];

        return [...acc, this.extendedEntity(ent), ...textEntities];
      },
      [],
    );

    const allEntities = [...firstTextEntities, ...followEntities];

    return {
      entities: allEntities.filter(ent => ent.type !== 'flag'),
      flags: new Map<string, string>(
        extractFlags(
          allEntities
            .filter(ent => ent.type === 'flag')
            .map(ent => ent.content),
        ),
      ),
    };
  }

  private extendedEntity({
    type,
    offset,
    length,
  }: ExtendedMessageEnity): ExtendedMessageEnity {
    return {
      offset,
      length,
      type,
      content: this.getEntityText({ offset, length }),
    };
  }

  private extractTextEntities(
    from: number,
    to: number,
  ): ExtendedMessageEnity[] {
    const text = this.getEntityText({ offset: from, length: to - from });

    const matchs = text.matchAll(/(\S+)/g);

    return Array.from(matchs).map(match => {
      const range = {
        offset: match.index + from,
        length: match[0].length,
      };

      const rawContent = this.getEntityText(range);
      const isFlag = flagRegex.exec(rawContent);

      return {
        ...range,
        content: rawContent,
        type: isFlag ? 'flag' : 'text',
      };
    });
  }

  replyWithRandomGif(gif: Gif) {
    return this.replyWithVideo(gif.gifs[randomInt({ max: gif.gifs.length })], {
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

  report(msg: string) {
    if (!this.settings.debugChatId) {
      return false;
    }

    return this.telegram.sendMessage(this.settings.debugChatId, msg);
  }
}
