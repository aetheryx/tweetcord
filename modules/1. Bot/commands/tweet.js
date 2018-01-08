async function tweetCommand (msg, args) {
  args = args.join(' ');

  const linkInfo = await this.db.getLink(msg.author.id);

  if (!linkInfo) {
    return `You haven't linked your Twitter account yet. Please do here: ${this.config.web.domain}/link?id=${msg.author.id}`;
  }


  const res = await this.RestClient.tweet(
    linkInfo.OAuthAccessToken,
    linkInfo.OAuthAccessSecret,
    args
  ).catch(e => {
    if (e.data.includes('"code":187')) {
      this.bot.sendMessage(msg.channel.id, {
        description: 'You\'ve already posted this tweet before.'
      });
    }
  });

  if (res) {
    return {
      title: 'Tweet Sent!',
      description: `[View here](https://twitter.com/${res.user.screen_name}/status/${res.id_str})`
    };
  }
}

module.exports = {
  command: tweetCommand,
  name: 'tweet',
  description: ''
}