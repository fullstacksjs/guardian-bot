import { Middleware } from 'telegraf';
import { Context } from '../../context';
import { Group } from '../../store';

const groupsLoader: Middleware<Context> = async (ctx, next) => {
  ctx.log('Load Groups');

  const groups = await ctx.db.groups.find<Group>({});

  ctx.groups = groups;

  next();
};

export default groupsLoader;
