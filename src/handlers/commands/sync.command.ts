import { Middleware } from 'telegraf-ts';
import dedent from 'dedent';
import { Context } from '../../context';
import { Group } from '../../store';

const syncHandler: Middleware<Context> = async (ctx, next) => {
  if (!ctx.isAdmin) {
    return next();
  }

  if (!ctx.isGroup) {
    await ctx.replyWithMarkdown(dedent`⚠️ Sync is a group command.`);

    return next();
  }

  await ctx.db.users.update({ id: ctx.from }, { $set: { status: 'admin' } });
  const link = await ctx.getGroupLink();

  if (!link) {
    await ctx.replyWithMarkdown(dedent`⚠️ **I can't export chat invite link.**
    make sure I am permitted to export chat invite link`);
  }

  const { id, title, type } = ctx.chat;
  const group = await ctx.db.groups.update<Group>(
    { id },
    { $set: { id, link, title, type } },
    { returnUpdatedDocs: true },
  );

  await ctx.replyWithMarkdown(
    `✅ The "[${group.title}](${group.link})" ${group.type} synced successfully.`,
  );

  return next();
};

export default syncHandler;
