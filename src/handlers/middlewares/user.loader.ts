import { Middleware } from 'telegraf';
import { Context } from '../../context';
import { User } from '../../store';
import { findOrCreate } from '../../utils';

const loadUser: Middleware<Context> = async (ctx, next) => {
  ctx.log('Load Users');

  const user = await findOrCreate<User>(ctx.db.users, { id: ctx.from.id }, { id: ctx.from.id, status: 'member' });
  ctx.user = user;

  next();
};

export default loadUser;
