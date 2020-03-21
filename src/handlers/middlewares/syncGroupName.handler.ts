import { Middleware } from 'telegraf-ts';
import { Context } from '../../context';
import { Group } from '../../store';

const syncGroupName: Middleware<Context> = (ctx, next) => {
  const { id, title } = ctx.chat;
  ctx.db.groups.update<Group>({ id }, { $set: { title } });

  return next();
};

export default syncGroupName;
