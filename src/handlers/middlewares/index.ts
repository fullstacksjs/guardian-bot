import { Composer } from 'telegraf';
import { Context } from '../../context';
import addedToGroupHandler from './addToGroup.handler';
import loadSettings from './settings.loader';
import loadUser from './user.loader';
import loadGroups from './groups.loader';
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

middlewares.use(loadSettings, loadGroups);
middlewares.on('new_chat_members', addedToGroupHandler);
middlewares.on('left_chat_member', kickHandler);
middlewares.use(leaveUnmanaged);
// middlewares.use(handleTimeout);
middlewares.on('new_chat_members', syncUsers);
middlewares.use(captcha);
middlewares.on(['new_chat_members', 'left_chat_member'], deleteWithDelay, logMemberEvents);

middlewares.use(loadUser);
middlewares.use(restrictUserHandler);
middlewares.use(forbiddenLinksHandler);

export default middlewares;
