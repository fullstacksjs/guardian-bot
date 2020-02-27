export function command(ctx) {
  const { message } = ctx;
  const messageID = message.reply_to_message.message_id || message.message_id;

  if (message.text.split(' ').length >= 2) {
    const noteTitle = message.text.split(' ')[1].toLowerCase();

    ctx.db.notes
      .findOne({ title: noteTitle })
      .then(res => {
        if (res) {
          ctx.reply(res.note, { reply_to_message_id: messageID });
        } else {
          ctx.reply(`${noteTitle} doesn't exist`, { reply_to_message_id: message.message_id });
        }
      })
      .catch(err => {
        throw new Error(err);
      });
  }
}

export function hashtag(ctx) {
  const { message } = ctx;
  const messageID = message.reply_to_message.message_id || message.message_id;
  const noteTitle = message.text.split(' ')[0].substring(1);

  ctx.db.notes
    .findOne({ title: noteTitle })
    .then(res => {
      if (res) {
        ctx.reply(res.note, { reply_to_message_id: messageID });
      }
    })
    .catch(err => {
      throw new Error(err);
    });
}
