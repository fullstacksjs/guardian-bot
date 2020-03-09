import { Middleware } from 'this-is-a-package-for-draft-stuff-please-dont-use-this-one';
import { Context } from '../../context';
import { User } from '../../store';
import { findOrCreate } from '../../utils';

const userLoader: Middleware<Context> = async (ctx, next) => {
  const user = await findOrCreate<User>(ctx.db.users, { id: ctx.from.id }, { id: ctx.from.id, status: 'member' });
  ctx.user = user;

  next();
};

export default userLoader;
