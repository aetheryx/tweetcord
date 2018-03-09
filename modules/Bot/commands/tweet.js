const GenericCommand = require(`${__dirname}/_GenericCommand.js`);
const emojiRX = /<:(\w+):\d+>/;

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
    const status = {
      status: args.join(' ').replace(emojiRX, ':$1:')
    };

    status.media_ids = await (async () => {
      let mediaURL;
      if (msg.embeds[0] && msg.embeds[0].type === 'image') {
        const url = msg.embeds[0].thumbnail.url;

        if (status.status.indexOf(url) === (status.status.length - url.length)) {
          status.status = status.status.replace(msg.embeds[0].url, '');
          mediaURL = url;
        }
      } else if (msg.attachments[0]) {
        mediaURL = msg.attachments[0].url;
      }

      return mediaURL
        ? this.RestClient.uploadMedia(link, mediaURL).then(r => r.media_id_string)
        : '';
    })();

    if (status.status > 280) { // We only check for the length *after* we remove any potential links to be embedded
      return `Your tweet is too big! You're ${args.length - 280} characters over the limit.`;
    }

    if (msg.mentions[0]) {
      await Promise.all(
        msg.mentions.map(async (member) => {
          member = msg.channel.guild.members.get(member.id);
          const link = await this.db.getLink(member.id);
          if (link) {
            status.status = status.status.replace(new RegExp(`@${member.nick || member.user.username}`), `@${link.name}`);
          }
        })
      );
    }

    const res = await this.RestClient.tweet(link, status).catch(e => {
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
        description: this.utils.parseTwitterEntities(this.utils.parseHTMLEntities(res.text), res.entities),
        image: { url: res.extended_entities && res.extended_entities.media ? res.extended_entities.media[0].media_url_https : '' },
        timestamp: new Date()
      };
    }
  }
});
