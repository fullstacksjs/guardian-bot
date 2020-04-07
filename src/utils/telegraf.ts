import { Middleware } from 'telegraf-ts';
import { Context } from '../context';
import { store } from '../store/store';
import { User } from '../store';
import { createOrUpdate } from '.';

export function syncSuperuser() {
  const superuserId = Number.parseInt(process.env.SUPER_USER_ID, 10);

  return createOrUpdate<User>(
    store.users,
    { id: superuserId },
    { $set: { status: 'superuser' } },
    { status: 'superuser', id: superuserId },
  );
}

const msgAlreadyDeleted = 'Bad Request: message to delete not found';
export const monkeyPatch: Middleware<Context> = (ctx, next) => {
  const originalDeleteMessage = ctx.deleteMessage;

  ctx.deleteMessage = async (...args) => {
    try {
      return await originalDeleteMessage(...args);
    } catch (err) {
      if (err.description === msgAlreadyDeleted) {
        return null;
      }

      throw err;
    }
  };

  return next();
};
