import { MessageEntity, Middleware, Composer } from 'telegraf';
import { tall } from 'tall';
import { Context } from '../../context';
import { getUrlFromEntity } from '../../utils';

const forbiddenLinksHandler: Middleware<Context> = (ctx, next) => {
  ctx.log('CheckForbiddenLinks');
  const message = ctx.editedMessage || ctx.message;

  if (!message || ctx.settings.allowLinks) {
    return next();
  }

  const entities: MessageEntity[] = message.caption_entities
    ? [...message.entities, ...message.caption_entities]
    : [...message.entities];

  entities.forEach(async entity => {
    const url: string = getUrlFromEntity(message, entity);

    if (!url) {
      return;
    }

    const normilizedUrl = /https?:\/\//.test(url) ? url : `http://${url}`;
    const unshortenedUrl = await tall(normilizedUrl);
    if (!unshortenedUrl) {
      return;
    }

    if (!ctx.isForbiddenUrl(unshortenedUrl)) {
      ctx.deleteMessage();
    }
  });

  return next();
};

export default Composer.optional<Context>(
  ctx => ctx.isGroup && !ctx.isSuperUser && !ctx.isAdmin,
  forbiddenLinksHandler,
);
