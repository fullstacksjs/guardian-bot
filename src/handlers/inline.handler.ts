import {
  Composer,
  InlineQueryResultPhoto,
  InlineQueryResultArticle,
} from 'telegraf-ts';
import { Context } from '../context';
import { getShot } from '../utils/shot';

const inline = new Composer<Context>();

inline.on('inline_query', async function handle(ctx: Context): Promise<any> {
  const code = ctx.inlineQuery?.query;

  if (!code) {
    return ctx.answerInlineQuery([]);
  }

  const shouldShot = code.trim().endsWith('/shot');

  if (!shouldShot) {
    return ctx.answerInlineQuery([
      {
        id: '1',
        type: 'article',
        input_message_content: {
          message_text: 'Please replay on a message',
          parse_mode: 'html',
        },
        title: 'Put "/shot" command when you done.',
      } as InlineQueryResultArticle,
    ]);
  }

  ctx.log(code);

  const shot = await getShot({ value: code });

  return ctx.answerInlineQuery([
    {
      id: '1',
      type: 'photo',
      title: '📸 Here is your codeshot',
      photo_url: `http://149.202.16.203:7001/${shot}`,
    } as InlineQueryResultPhoto,
  ]);
});

inline.on('chosen_inline_result', ({ log, chosenInlineResult }) => {
  log('chosen inline result', chosenInlineResult);
});

export default inline;
