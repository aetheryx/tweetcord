const GenericCommand = require(`${__dirname}/_GenericCommand.js`);

module.exports = GenericCommand({
  name: 'tweet',
  aliases: ['weet'],
  usage: '{command} <text you want to tweet>',
  description: 'Use this command to tweet stuff.'
}, {
  requiresLink: true,
  requiresTimeline: false,
  requiredArgs: 'Missing required arguments. What do you want to tweet?',
  commandFn: async function tweetCommand (msg, args, link) {
    if (args.join(' ').length > 280) {
      return `Your tweet is too big! You're ${args.length - 280} characters over the limit.`;
    }

    let mediaID;
    if (msg.attachments[0]) {
      mediaID = await this.RestClient.uploadMedia(link, msg.attachments[0].url).then(r => r.media_id_string);
    }

    const res = await this.RestClient.tweet(link, {
      status: args.join(' '),
      media_ids: mediaID
    }).catch(e => {
      if (e.errors && e.errors.find(e => e.code === 187)) {
        this.bot.sendMessage(msg.channel.id, 'You\'ve already posted this tweet before.');
      } else {
        throw e;
      }
    });

    if (res) {
      return {
        title: 'Tweet successfully sent',
        url: `https://twitter.com/${res.user.screen_name}/status/${res.id_str}`,
        description: this.utils.parseEntities(res.text),
        timestamp: new Date()
      };
    }
  }
});