import { Middleware } from 'telegraf-ts';
import { Context } from '../../context';
import { Group } from '../../store';

const syncGroupName: Middleware<Context> = async (ctx, next) => {
  const { id, title } = ctx.chat;
  await ctx.db.groups.update<Group>({ id }, { $set: { title } });

  return next();
};

export default syncGroupName;
