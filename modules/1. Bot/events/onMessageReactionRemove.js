const actions = {
  '400076857493684226': 'unlike',
  '400076876430835722': 'unretweet'
};

async function onMessageReactionRemove (message, emoji, userID) {
  message = await this.bot
    .guilds.get(message.channel.guild.id)
    .channels.get(message.channel.id)
    .getMessage(message.id);

  if (
    !message ||
    message.author.id !== this.bot.user.id ||
    !message.embeds[0] || message.embeds[0].title !== 'New Tweet' ||
    !emoji.id || !['400076876430835722', '400076857493684226'].includes(emoji.id)
  ) {
    return;
  }

  const [tweetID, ownerID] = message.embeds[0].description.match(/"(.*)"\)/)[1].split('|');

  if (ownerID !== userID) {
    return;
  }

  const link = await this.db.getLink(ownerID);

  this.RestClient[actions[emoji.id]](link.OAuthAccessToken, link.OAuthAccessSecret, tweetID);
  message = await this.bot.sendMessage(message.channel.id, {
    title: `Successfully ${actions[emoji.id] === 'un' ? 'unliked' : 'unretweeted'} the following tweet:`,
    description: message.embeds[0].description,
    footer: { text: 'This message will self-destruct in 5 seconds.' }
  });
  setTimeout(message.delete.bind(message), 5e3);
}

module.exports = onMessageReactionRemove;