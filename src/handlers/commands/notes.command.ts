import { Middleware } from 'telegraf-ts';
import { Context } from '../../context';
import { Note } from '../../store/note';
import md from '../../utils/md';

const notesHandler: Middleware<Context> = async ctx => {
  const { message } = ctx;
  const messageID = message.message_id;

  const notes = await ctx.db.notes.find<Note>({});

  if (notes.length <= 0) {
    ctx.reply('There is no note', { reply_to_message_id: messageID });
    return;
  }

  await ctx.replyWithMarkdown(
    `List of notes:\n${md.list(
      notes.map(n => n.title),
    )}\nYou can retrieve these notes by using: \n\`/get notename\` or\n \`#notename\``,
    { reply_to_message_id: messageID },
  );
};

export default notesHandler;
