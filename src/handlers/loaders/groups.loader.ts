import { Middleware } from 'telegraf-ts';
import { Context } from '../../context';
import { Group } from '../../store';

const groupsLoader: Middleware<Context> = async (ctx, next) => {
  const groups = await ctx.db.groups.find<Group>({});

  ctx.groups = groups;

  return next();
};

export default groupsLoader;
