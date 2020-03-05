import { Composer } from 'telegraf';
import { Context } from '../../context';
import { showCaptcha } from './captcha';
import { onPass } from './pass';
import { onReject } from './reject';
import { unban } from './unban';

const captcha = new Composer<Context>();

captcha.on('new_chat_members', showCaptcha);
captcha.action(/^(no)-(\d+)$/, onPass);
captcha.action(/^(kick)-(\d+)$/, onReject);
captcha.command('unban', unban);

export { captcha };
