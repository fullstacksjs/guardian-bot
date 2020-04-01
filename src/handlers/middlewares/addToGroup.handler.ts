import { Middleware } from 'telegraf-ts';
import dedent from 'dedent';
import { Context } from '../../context';
import { Group } from '../../store';

const addedToGroupHandler: Middleware<Context> = async (ctx, next) => {
  const msg = ctx.message;

  const isMe = msg.new_chat_members.some(user => user.username === ctx.me);

  if (!isMe || !ctx.isSuperUser) {
    return next();
  }

  ctx.log('AddedToGroupHandler');

  await ctx.db.users.update({ id: ctx.from }, { $set: { status: 'admin' } });
  const link = await ctx.getGroupLink();

  if (!link) {
    await ctx.replyWithMarkdown(dedent`⚠️ **I can't export chat invite link.**
        make sure I am permitted to export chat invite link`);
  }

  const { id, title, type } = ctx.chat;
  const newGroup = await ctx.db.groups.insert<Group>({ id, link, title, type });
  ctx.groups.push(newGroup);
  await ctx.replyWithRandomGif(ctx.gifs.start);

  return next();
};

export default addedToGroupHandler;
