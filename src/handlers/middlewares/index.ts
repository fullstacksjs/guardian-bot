import { Composer } from 'telegraf';
import { Context } from '../../context';
import settingsLoader from '../loaders/settings.loader';
import userLoader from '../loaders/user.loader';
import groupsLoader from '../loaders/groups.loader';
import addedToGroupHandler from './addToGroup.handler';
import forbiddenLinksHandler from './forbiddenLinks.handler';
import restrictUserHandler from './restrictUser.handler';
import deleteWithDelay from './deleteWithDelay.handler';
import timeoutHandler from './timeout.handler';
import kickHandler from './kickFromGroup.handler';
import leaveUnmanaged from './leaveUnmanagedGroup.handler';
import logMemberEvents from './logMemberEvents';
import syncUsers from './syncUsers';
import captcha from './captcha';

const middlewares = new Composer<Context>();

middlewares.use(settingsLoader);
middlewares.use(timeoutHandler);
middlewares.use(groupsLoader);
middlewares.on('new_chat_members', addedToGroupHandler);
middlewares.on('left_chat_member', kickHandler);
middlewares.use(leaveUnmanaged);
middlewares.on('new_chat_members', syncUsers);
middlewares.use(captcha);
middlewares.on(['new_chat_members', 'left_chat_member'], deleteWithDelay, logMemberEvents);

middlewares.use(userLoader);
middlewares.use(restrictUserHandler);
middlewares.use(forbiddenLinksHandler);

export default middlewares;
