import { MessageEntity, Middleware, Composer } from 'telegraf-ts';
import { tall } from 'tall';
import { Context } from '../../context';

const forbiddenLinksHandler: Middleware<Context> = async (ctx, next) => {
  const message = ctx.editedMessage || ctx.message;

  if (!message || ctx.settings.allowLinks) {
    return next();
  }

  ctx.log('CheckForbiddenLinks');

  const entities: MessageEntity[] = message.caption_entities
    ? [...message.entities, ...message.caption_entities]
    : [...message.entities];

  await Promise.all(
    entities.map(entity => {
      const url: string = ctx.getUrlFromEntity(entity);

      if (!url) {
        return Promise.resolve(null);
      }

      const normilizedUrl = /https?:\/\//.test(url) ? url : `http://${url}`;
      return tall(normilizedUrl)
        .then((unshortenedUrl: string) => ctx.isForbiddenUrl(unshortenedUrl))
        .then((isForbidden: boolean) => (isForbidden ? ctx.deleteMessage() : Promise.resolve(null)));
    }),
  );

  return next();
};

export default Composer.optional<Context>(ctx => ctx.isGroup && !ctx.isAdmin, forbiddenLinksHandler);
