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
    .getMessage(message.id)
    .catch(e => null);

  if (
    !message ||
    !message.embeds[0] ||
    !message.embeds[0].description ||
    message.author.id !== this.bot.user.id ||
    (this.bot.users.get(userID) || { bot: true }).bot ||
    !emoji.id || !['400076876430835722', '400076857493684226'].includes(emoji.id)
  ) {
    return;
  }

  const tweetID = message.embeds[0].description.match(/"(.*)"\)/)[1];

  const link = await this.db.getLink(userID);
  if (!link) {
    return;
  }

  const action = actions[type][emoji.id];

  const pastTense = (action.startsWith('un') ? 'un' : '') + (action.endsWith('like') ? 'liked' : 'retweeted');

  this.RestClient[action](link, { id: tweetID })
    .then(() => {
      this.bot.sendMessage(userID, {
        title: `Successfully ${pastTense} the following tweet:`,
        description: message.embeds[0].description,
        footer: { text: 'This message will self-destruct in 15 seconds.' }
      }, true);
    })
    .catch(e => {
      let errorMessage;
      if (!e.errors) {
        this.log('onMessageReaction unknown error');
        this.log(e);
      }
      if (e.errors[0].code === 139 || e.errors[0].code === 327) {
        errorMessage = `You have already ${pastTense} this tweet.`;
      }
      if (e.errors[0].code === 144) {
        errorMessage = `This tweet was deleted${pastTense.includes('un') ? `, or you've never ${pastTense.replace('un', '')} this tweet` : ''}.`;
      }

      this.bot.sendMessage(userID, {
        color: 0xFF0000,
        description: `${errorMessage} I am unable to ${action} this tweet.`
      }, true);
    });
}

async function add (...args) {
  return onMessageReactionGeneric.call(this, 'add', ...args);
}

async function remove (...args) {
  return onMessageReactionGeneric.call(this, 'remove', ...args);
}

module.exports = { add, remove };
