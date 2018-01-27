async function tweetCommand (msg, args) {
  args = args.join(' ');
  if (!args) {
    return 'Missing required arguments.';
  }

  const linkInfo = await this.db.getLink(msg.author.id);

  if (!linkInfo) {
    return `You haven't linked your Twitter account yet. Please do here: ${this.config.web.domain}/link?id=${msg.author.id}`;
  }

  if (args.length > 280) {
    return `Your tweet is too big! You're ${args.length - 280} characters over the limit.`;
  }

  const res = await this.RestClient.tweet(
    linkInfo.OAuthAccessToken,
    linkInfo.OAuthAccessSecret,
    { status: args }
  ).catch(e => {
    if (e.errors && e.errors.find(e => e.code === 187)) {
      this.bot.sendMessage(msg.channel.id, 'You\'ve already posted this tweet before.');
    }
  });

  if (res) {
    return {
      title: 'Tweet successfully sent',
      url: `https://twitter.com/${res.user.screen_name}/status/${res.id_str}`,
      description: res.text,
      timestamp: new Date()
    };
  }
}

module.exports = {
  command: tweetCommand,
  name: 'tweet',
  aliases: ['weet'],
  description: ''
};