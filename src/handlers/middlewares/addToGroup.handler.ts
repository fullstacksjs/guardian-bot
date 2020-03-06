import { Middleware } from 'telegraf';
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
    await ctx.replyWithHTML(dedent`⚠️ <b>I can't export chat invite link.</b>
        make sure I am permitted to export chat invite link`);
  }

  const { id, title, type } = ctx.chat;
  const newGroup = await ctx.db.groups.insert<Group>({ id, link, title, type });
  ctx.groups.push(newGroup);
  ctx.replyWithRandomGif(ctx.gifs.start);

  next();
};

export default addedToGroupHandler;
