import { Middleware } from 'telegraf-ts';
import { Context } from '../../context';
import { getUsername } from '../../utils';

const logMemberEvents: Middleware<Context> = (ctx, next) => {
  ctx.log('LogMemberEvents');

  if (!ctx.settings.debugChatId) {
    return next();
  }

  switch (ctx.updateSubTypes[0]) {
    case 'new_chat_members': {
      const newUsers = ctx.message.new_chat_members.map(getUsername).join('\n');
      ctx.telegram.sendMessage(ctx.settings.debugChatId, `New Users:\n${newUsers}`);
      break;
    }
    case 'left_chat_member': {
      ctx.telegram.sendMessage(
        ctx.settings.debugChatId,
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
