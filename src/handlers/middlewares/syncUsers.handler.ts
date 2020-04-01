import { Middleware } from 'telegraf-ts';
import { Context } from '../../context';
import { User } from '../../store';

const syncUsers: Middleware<Context> = async (ctx, next) => {
  ctx.log('SyncUsers');
  const { message } = ctx;
  const { new_chat_members } = message;

  await Promise.all(
    new_chat_members
      .filter(member => !member.is_bot)
      .map(member =>
        ctx.db.users
          .findOne<User>({ id: member.id })
          .then(user => {
            if (!user) return Promise.resolve(null);

            switch (user.status) {
              case 'admin':
                return ctx.promoteChatMember(user.id, {
                  can_change_info: false,
                  can_delete_messages: true,
                  can_invite_users: true,
                  can_pin_messages: true,
                  can_promote_members: false,
                  can_restrict_members: true,
                });
              case 'restricted':
                return ctx.promoteChatMember(user.id, {
                  can_change_info: false,
                  can_delete_messages: false,
                  can_invite_users: false,
                  can_pin_messages: false,
                  can_promote_members: false,
                  can_restrict_members: false,
                });
              case 'banned':
                return ctx.kickChatMember(user.id);
              case 'member':
                return null;
              default:
                throw new Error(`Unexpected member status: ${user.status}`);
            }
          }),
      ),
  );

  return next();
};

export default syncUsers;
