const actions = {
  add: {
    '400076857493684226': 'like',
    '400076876430835722': 'retweet'
  },
  remove: {
    '400076857493684226': 'unlike',
    '400076876430835722': 'unretweet'
  }
};

async function onMessageReactionGeneric (type, message, emoji, userID) {
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

  const action = actions[type][emoji.id];

  const res = await this.RestClient[action](link.OAuthAccessToken, link.OAuthAccessSecret, tweetID)
    .catch(async e => {
      return console.log(e);
      if (e.data.includes('"code":144')) {
        message = await this.bot.sendMessage(message.channel.id, {
          color: 0xFF0000,
          description: `This tweet was deleted; I am unable to ${action} this tweet.`,
          footer: { text: 'This message will self-destruct in 15 seconds.'}
        });
      }
    });

    console.log(res)

  if (res) {
    message = await this.bot.sendMessage(message.channel.id, {
      title: `Successfully ${action.startsWith('un') ? 'un' : ''}${action.endsWith('like') ? 'liked' : 'retweeted'} the following tweet:`,
      description: message.embeds[0].description,
      footer: { text: 'This message will self-destruct in 15 seconds.' }
    });
  }

  setTimeout(message.delete.bind(message), 15e3);
}

async function add (...args) {
  return onMessageReactionGeneric.call(this, 'add', ...args);
}

async function remove (...args) {
  return onMessageReactionGeneric.call(this, 'remove', ...args);
}

module.exports = { add, remove };