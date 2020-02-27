export default ctx => {
  const { message } = ctx;
  const messageID = message.message_id;

  ctx.db.notes
    .find({})
    .then(res => {
      if (res.length > 0) {
        const notes = res.map(note => {
          return note.title;
        });
        ctx.reply(`📑 List of notes:\n\n- ${notes.join('\n- ')}`, { reply_to_message_id: messageID });
      } else {
        ctx.reply("😓 There isn't any note here.", { reply_to_message_id: messageID });
      }
    })
    .catch(err => {
      throw new Error(err);
    });
};
