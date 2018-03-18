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
    .catch(e => {
      if (e.message.includes('50001')) {
        this.bot.sendMessage(message.channel.id, {
          color: 0xFF0000,
          title: '⚠',
          description: 'I seem to be missing the `Read Message History` permission for this channel. I need this permission to work!'
        });
      }
    });

  if (
    !message ||
    message.author.id !== this.bot.user.id ||
    (this.bot.users.get(userID) || { bot: true }).bot ||
    !emoji.id || !['400076876430835722', '400076857493684226'].includes(emoji.id)
  ) {
    return;
  }

  let prompt;
  const tweetID = message.embeds[0].description.match(/"(.*)"\)/)[1];

  const link = await this.db.getLink(userID);
  if (!link) {
    return;
  }

  const action = actions[type][emoji.id];

  const pastTense = (action.startsWith('un') ? 'un' : '') + (action.endsWith('like') ? 'liked' : 'retweeted');

  const res = await this.RestClient[action](link, { id: tweetID })
    .catch(async e => {
      let errorMessage;
      if (!e.errors) {
        this.log('onMessageReaction unknown error');
        this.log(e);
      }
      if (e.errors[0].code === 261) {
        prompt = this.bot.sendMessage(message.channel.id, {
          title: 'Ehmm... fuck.',
          color: 0xFF0000,
          description: 'On 18th March 2018, around 6am PST, Tweetcord\'s Twitter application was given a read-only block by Twitter.',
          fields: [
            {
              name: 'What does this mean?',
              value: 'There\'s alot that can go wrong when making a bot. Twitter didn\'t actually tell me *why* Tweetcord was given a read-only block, but it could be many things - a bug that caused Tweetcord to spam their API, etc.'
            },
            {
              name: 'What now?',
              value: 'I am talking to Twitter support to get this block lifted as soon as possible. Until then, there\'s nothing we can do but wait.'
            }
          ],
          footer: { text: '- Aetheryx#2222, the developer of Tweetcord' }
        });
        return;
      }
      if (e.errors[0].code === 139 || e.errors[0].code === 327) {
        errorMessage = `You have already ${pastTense} this tweet.`;
      }
      if (e.errors[0].code === 144) {
        errorMessage = `This tweet was deleted${pastTense.includes('un') ? `, or you've never ${pastTense.replace('un', '')} this tweet` : ''}.`;
      }

      prompt = await this.bot.sendMessage(message.channel.id, {
        color: 0xFF0000,
        description: `${errorMessage} I am unable to ${action} this tweet.`,
        footer: { text: 'This message will self-destruct in 15 seconds.' }
      });
    });

  if (res) {
    prompt = await this.bot.sendMessage(message.channel.id, {
      title: `Successfully ${pastTense} the following tweet:`,
      description: message.embeds[0].description,
      footer: { text: 'This message will self-destruct in 15 seconds.' }
    });
  }

  setTimeout(prompt.delete.bind(prompt), 15e3);
}

async function add (...args) {
  return onMessageReactionGeneric.call(this, 'add', ...args);
}

async function remove (...args) {
  return onMessageReactionGeneric.call(this, 'remove', ...args);
}

module.exports = { add, remove };
