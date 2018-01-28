const cooldowns = new Set();

const events = [
  'favorite',
  'follow'
];

const replies = {
// Event type     Human-readable reply    Author    Resource        Related to a tweet?
  'follow':   [ 'followed you' ,         'source', 'target',        false ],
  'favorite': [ 'liked your tweet:',     'source', 'target_object', true  ],
  'retweet':  [ 'retweeted your tweet:', 'user',    null,           true  ],
  'mention':  [ 'mentioned you:',        'user',    null,           true  ],
  'tweet':    [ 'tweeted:',              'user',    null,           true  ]
};

async function postMessage (res, timeline, link) {
  if (res.delete || res.events && !events.includes(res.event)) {
    return;
  }

  let event;

  if (
    Boolean(res.event) === events.includes(res.event) &&
    !(res.target && res.target.id_str !== link.twitterID) &&
    !cooldowns.has(res.source.id_str)
  ) {
    cooldowns.add(res.source.id_str);
    setTimeout(() => cooldowns.delete(res.source.id_str), 30e3);
    if (res.event in replies) {
      event = Object.keys(replies).find(g => g === res.event);
    } else if (res.retweeted_status && res.retweeted_status.user.id_str === link.twitterID) {
      event = 'retweet';
    } else if (res.in_reply_to_user_id_str === link.twitterID) {
      event = 'mention';
    } else {
      event = 'tweet';
    }
  } else {
    return;
  }

  const react = event.endsWith('tweet');
  const reply = replies[event];
  const tweet = res[reply[2]] || res;

  const msg = await this.bot.sendMessage(timeline.channelID, {
    title: `@${res[reply[1]].screen_name} ${reply[0]}`,
    url: `https://twitter.com/${res[reply[1]].screen_name}/${reply[3] ? `/status/${tweet.id_str}` : ''}`,
    author: {
      name: `@${res[reply[1]].screen_name}`,
      url: `https://twitter.com/${res[reply[1]].screen_name}`,
      icon_url: res[reply[1]].profile_image_url
    },
    description: `${reply[3] ? tweet.extended_tweet ? tweet.extended_tweet.full_text : tweet.text : ''}${react ? ` [\u200b]( "${tweet.id_str}")` : ''}`,
    timestamp: new Date(res.created_at)
  });

  if (msg && react) {
    await msg.addReaction('twitterLike:400076857493684226');
    msg.addReaction('twitterRetweet:400076876430835722');
  }
}

async function init () {
  this.streams = [];
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
          return postMessage.call(this, parsed, timeline, link);
        }
      });
      this.streams.push(() => { r.destroy(); stream.destroy(); });

    });
  }
}

module.exports = init;