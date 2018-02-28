const cooldowns = new Set();

const events = [
  'favorite',
  'quoted_tweet',
  'follow'
];

const replies = {
// Event type   Human-readable reply      Author    Source             Target    Tweet?  Whether to ignore when not directed at the user
  'quote':    [ 'quoted your tweet:',    'user',   'quoted_status',    'user',   true,   false ],
  'favorite': [ 'liked your tweet:',     'source', 'target_object',    'user',   false,  true  ],
  'retweet':  [ 'retweeted your tweet:', 'user',   'retweeted_status', 'user',   true,   false ],
  'mention':  [ 'mentioned you:',        'user',    null,              null,     true,   false ],
  'tweet':    [ 'tweeted:',              'user',    null,              null,     true,   false ],
  'follow':   [ 'followed you',          'source',  null,              'target', false,  true  ]
};

async function postMessage (res, timeline, link) {
  if (
    res.delete || // TODO: Parse delete events
    res.direct_message || // TODO: Parse DMs
    (res.event && !events.includes(res.event)) ||
    res.friends
  ) {
    return;
  }

  let event;

  if (res.event in replies) {
    event = Object.keys(replies).find(g => g === res.event);
  } else if (res.retweeted_status) {
    event = 'retweet';
  } else if (res.is_quote_status || (res.target_object && res.target_object.is_quote_status)) {
    if (res.event !== 'quoted_tweet' && res.quoted_status.user.id_str === link.twitterID) {
      return;
    }
    event = 'quote';
    if (res.target_object && res.target_object.is_quote_status) {
      res = res.target_object;
    }
  } else if (res.entities && res.entities.user_mentions.find(m => m.id_str === link.twitterID)) {
    event = 'mention';
  } else {
    event = 'tweet';
  }

  const info = replies[event];
  let replyString = info[0];
  const author = res[info[1]];
  const source = res[info[2]];
  const resource = res.text ? res : source || {};
  const target = (source && source[info[3]]) || res[info[3]] || author;
  const isTweet = info[4];

  if (
    cooldowns.has(author.id_str) ||
    (info[5] && target.id_str !== link.twitterID) ||
    (timeline.isUserStream && author.id_str !== timeline.twitterID)
  ) {
    return;
  }

  if (target && target.id_str !== link.twitterID) {
    replyString = replyString.replace('your', `@${target.screen_name}'s`);
  }

  const tweetBody = (() => {
    let body = event === 'retweet'
      ? `RT @${resource.retweeted_status.user.screen_name}: ${resource.retweeted_status.extended_tweet ? resource.retweeted_status.extended_tweet.full_text : resource.retweeted_status.text}` // Because TWAPI is dumb and truncates retweets without providing the full body, we construct it ourselves
      : (resource.extended_tweet ? resource.extended_tweet.full_text : resource.text) || ''; // empty string fallback in the case of follows, which don't have a tweet body

    // We mask the tweet ID in the description with a cheeky zws hyperlink, it's later used in Bot/events/onMessageReactionAdd for retweet/like actions
    const metadata = isTweet ? ` [\u200b]( "${resource.id_str}")` : '';

    body = this.utils.parseHTMLEntities(body);
    body = this.utils.parseTwitterEntities(body, resource.entities) + metadata;
    return body;
  })();

  const msg = await this.bot.sendMessage(timeline.channelID, {
    title: `${author.name} ${replyString}`,
    url: `https://twitter.com/${author.screen_name}${isTweet ? `/status/${resource.id_str}` : ''}`,
    author: {
      name: `${author.name} (@${author.screen_name})`,
      url: `https://twitter.com/${author.screen_name}`,
      icon_url: author.profile_image_url
    },
    image: {
      url: resource.extended_entities && resource.extended_entities.media ? resource.extended_entities.media[0].media_url_https : ''
    },
    description: tweetBody,
    timestamp: new Date(res.created_at),
    footer: { text: resource.place ? resource.place.full_name : author.location }
  });

  if (msg && isTweet) {
    await msg.addReaction('twitterLike:400076857493684226');
    if (!['retweet', 'quote'].includes(event)) {
      msg.addReaction('twitterRetweet:400076876430835722');
    }

    cooldowns.add(author.id_str);
    setTimeout(() => cooldowns.delete(author.id_str), 15e3);
  }
}

module.exports = postMessage;
