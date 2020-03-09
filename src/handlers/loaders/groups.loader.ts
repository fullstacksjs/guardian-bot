import { Middleware } from 'this-is-a-package-for-draft-stuff-please-dont-use-this-one';
import { Context } from '../../context';
import { Group } from '../../store';

const groupsLoader: Middleware<Context> = async (ctx, next) => {
  ctx.log('Load Groups');

  const groups = await ctx.db.groups.find<Group>({});

  ctx.groups = groups;

  next();
};

export default groupsLoader;
