import { Middleware } from 'telegraf';
import { Context } from '../../../context';
import { Note } from '../../../store/note';

export const listNotes: Middleware<Context> = ctx => {
  const { message } = ctx;
  const messageID = message.message_id;

  ctx.db.notes.find<Note>({}).then(res => {
    if (res.length <= 0) {
      ctx.reply('There is no note', { reply_to_message_id: messageID });
      return;
    }

    const notes = res.map(note => `\`- ${note.title}\``).join('\n');
    ctx.replyWithMarkdown(
      `List of notes:\n${notes}\nYou can retrieve these notes by using: \n\`/get notename\` or\n \`#notename\``,
      { reply_to_message_id: messageID },
    );
  });
};
