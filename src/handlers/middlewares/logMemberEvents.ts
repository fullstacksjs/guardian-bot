import { Middleware } from 'telegraf-ts';
import { Context } from '../../context';
import { getUsername } from '../../utils';

const logMemberEvents: Middleware<Context> = async (ctx, next) => {
  if (!ctx.settings.debugChatId) {
    return next();
  }

  ctx.log('LogMemberEvents');

  switch (ctx.updateSubTypes[0]) {
    case 'new_chat_members': {
      const newUsers = ctx.message.new_chat_members.map(getUsername).join('\n');
      await ctx.report(`New Users:\n${newUsers}`);
      break;
    }
    case 'left_chat_member': {
      await ctx.report(
        `${getUsername(ctx.message.left_chat_member)} left ${ctx.chat.title}`,
      );
      break;
    }
    default:
      break;
  }

  return next();
};

export default logMemberEvents;
