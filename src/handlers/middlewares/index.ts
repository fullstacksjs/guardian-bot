import { Composer } from 'telegraf-ts';
import { Context } from '../../context';
import groupsLoader from '../loaders/groups.loader';
import settingsLoader from '../loaders/settings.loader';
import userLoader from '../loaders/user.loader';
import addedToGroupHandler from './addToGroup.handler';
import captcha from './captcha';
import deleteWithDelay from './deleteWithDelay.handler';
import forbiddenLinksHandler from './forbiddenLinks.handler';
import kickHandler from './kickFromGroup.handler';
import leaveUnmanaged from './leaveUnmanagedGroup.handler';
import logMemberEvents from './logMemberEvents';
import restrictUserHandler from './restrictUser.handler';
import syncGroupName from './syncGroupName.handler';
import syncUsers from './syncUsers.handler';
import timeoutHandler from './timeout.handler';

const middlewares = new Composer<Context>();

middlewares.use(settingsLoader);
middlewares.use(timeoutHandler);
middlewares.use(groupsLoader);
middlewares.on('new_chat_title', syncGroupName);
middlewares.on('new_chat_members', addedToGroupHandler);
middlewares.on('left_chat_member', kickHandler);
middlewares.use(leaveUnmanaged);
middlewares.on('new_chat_members', syncUsers);
middlewares.on(
  ['new_chat_members', 'left_chat_member'],
  deleteWithDelay,
  logMemberEvents,
);
middlewares.use(captcha);
middlewares.use(userLoader);
middlewares.use(restrictUserHandler);
middlewares.use(forbiddenLinksHandler);

export default middlewares;
