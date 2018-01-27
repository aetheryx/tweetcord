const cooldowns = new Set();

const aliases = {
  'favorite': 'liked',
  'unfavorite': 'unliked'
}

async function postMessage (res, timeline) {
  if (res.delete) {
    return;
  }
  if (res.event && !cooldowns.has(res.source.id_str)) {
    cooldowns.add(res.source.id_str);
    setTimeout(() => cooldowns.delete(res.source.id_str), 30000);
    return this.bot.sendMessage(timeline.channelID, {
      author: {
        name: `${res.source.name} ${aliases[res.event]} your tweet.`,
        url: `https://twitter.com/${res.source.screen_name}`,
        icon_url: res.source.profile_image_url
      },
      description: res.target_object.text,
      timestamp: new Date(res.created_at)
    });
  }
  const hiddenMetadata = ` [\u200b]( "${res.id_str}|${timeline.userID}")`;

  const msg = await this.bot.sendMessage(timeline.channelID, {
    title: res.retweeted_status ? '' : 'New Tweet',
    author: {
      name: `${res.user.name} ${res.retweeted_status ? 'retweeted your tweet.' : ''}`,
      url: `https://twitter.com/${res.user.screen_name}`,
      icon_url: res.user.profile_image_url
    },
    url: `https://twitter.com/${res.user.screen_name}/status/${res.id_str}`,
    description: res.text + hiddenMetadata,
    timestamp: new Date(res.created_at)
  });
  if (msg) {
    await msg.addReaction('twitterLike:400076857493684226');
    msg.addReaction('twitterRetweet:400076876430835722');
  }
}

async function init () {
  const timelines = await this.db.getAllTimelines();

  for (const timeline of timelines) {
    const link = await this.db.getLink(timeline.userID);
    if (!link) {
      return; // TODO: remove link
    }

    const stream = await this.RestClient.createTweetStream(
      link.OAuthAccessToken,
      link.OAuthAccessSecret,
      true
    );

    stream.on('response', (r) => {
      let currentMessage = '';
      const parse = (chunk) => {
        currentMessage += chunk;
        chunk = currentMessage;
        if (chunk.endsWith('\r\n')) {
          currentMessage = '';
          return JSON.parse(chunk);
        }
      };

      r.on('data', (data) => {
        data = data.toString();
        if (data === '\r\n' || data.startsWith('{"friends')) { // Ignore keep-alives.
          return;
        }
        const parsed = parse(data);
        if (parsed) {
          return postMessage.call(this, parsed, timeline);
        }
      });
    });
  }
}

module.exports = init;