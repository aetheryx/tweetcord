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

  const link = await this.db.getLink(userID);

  if (!link) {
    return;
  }

  const action = actions[type][emoji.id];
  const pastTense = (action.startsWith('un') ? 'un' : '') + (action.endsWith('like') ? 'liked' : 'retweeted');

  const res = await this.RestClient[action](link.OAuthAccessToken, link.OAuthAccessSecret, tweetID)
    .catch(async e => {
      let errorMessage;
      if (e.errors[0].code === 139 || e.errors[0].code === 327) {
        errorMessage = `You have already ${pastTense} this tweet.`;
      }
      if (e.errors[0].code === 144) {
        errorMessage = `This tweet was deleted, or you've never ${pastTense.replace(/un/, '')} this tweet.`;
      }

      message = await this.bot.sendMessage(message.channel.id, {
        color: 0xFF0000,
        description: `${errorMessage} I am unable to ${action} this tweet.`,
        footer: { text: 'This message will self-destruct in 15 seconds.' }
      });
    });


  if (res) {
    message = await this.bot.sendMessage(message.channel.id, {
      title: `Successfully ${pastTense} the following tweet:`,
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