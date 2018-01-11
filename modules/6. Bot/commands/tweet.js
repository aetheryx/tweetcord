async function tweetCommand (msg, args) {
  args = args.join(' ');

  const linkInfo = await this.db.getLink(msg.author.id);

  if (!linkInfo) {
    return `You haven't linked your Twitter account yet. Please do here: ${this.config.web.domain}/link?id=${msg.author.id}`;
  }

  if (args.length > 280) {
    return `Your tweet is too big! You're ${280 - args.length} characters over the limit.`;
  }

  const res = await this.RestClient.tweet(
    linkInfo.OAuthAccessToken,
    linkInfo.OAuthAccessSecret,
    args
  ).catch(e => {
    console.log(e);
    if (e.data.includes('"code":187')) {
      this.bot.sendMessage(msg.channel.id, 'You\'ve already posted this tweet before.');
    }
  });

  if (res) {
    return {
      title: 'Tweet successfully sent',
      description: `View [here](https://twitter.com/${res.user.screen_name}/status/${res.id_str})`,
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