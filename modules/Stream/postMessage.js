const cooldowns = new Set();

const events = [
  'favorite',
  'quoted_tweet',
  'follow'
];

const replies = {
// Event type   Human-readable reply      Author    Source             Target    Tweet?  Whether to ignore when not directed at the user
  'quote':    [ 'quoted your tweet:',    'user',   'quoted_status',    'user',   true,   false ],
  'favorite': [ 'liked your tweet:',     'source', 'target_object',    'user',   true,   true  ],
  'retweet':  [ 'retweeted your tweet:', 'user',   'retweeted_status', 'user',   true,   false ],
  'mention':  [ 'mentioned you:',        'user',    null,              null,     true,   false ],
  'tweet':    [ 'tweeted:',              'user',    null,              null,     true,   false ],
  'follow':   [ 'followed you' ,         'source',  null,              'target', false,  true  ]
};

async function postMessage (res, timeline, link) {
  if (res.delete || res.event && !events.includes(res.event)) { // TODO: Parse delete events properly
    return;
  }

  let event;

  if (res.event in replies) {
    event = Object.keys(replies).find(g => g === res.event);
  } else if (res.retweeted_status) { //  && res.retweeted_status.user.id_str === link.twitterID
    event = 'retweet';
  } else if (res.is_quote_status || res.target_object && res.target_object.is_quote_status) {
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
  const target = source && source[info[3]] || res[info[3]] || author;
  const isTweet = info[4];

  if (info[5] && target.id_str !== link.twitterID || cooldowns.has(res.source.id_str)) {
    return;
  }

  if (target && target.id_str !== link.twitterID) {
    replyString = replyString.replace('your', `@${target.screen_name}'s`);
  }

  const msg = await this.bot.sendMessage(timeline.channelID, {
    title: `@${author.screen_name} ${replyString}`,
    url: `https://twitter.com/${author.screen_name}/${isTweet ? `/status/${resource.id_str}` : ''}`,
    author: {
      name: `@${author.screen_name}`,
      url: `https://twitter.com/${author.screen_name}`,
      icon_url: author.profile_image_url
    },
    description: resource.text,
    timestamp: new Date(res.created_at)
  });

  if (msg && isTweet) {
    await msg.addReaction('twitterLike:400076857493684226');
    msg.addReaction('twitterRetweet:400076876430835722');

    cooldowns.add(author.id_str);
    setTimeout(() => cooldowns.delete(author.id_str), 30e3);
  }
}



module.exports = postMessage;

// ${isTweet ? resource.extended_tweet ? tweet.extended_tweet.full_text : tweet.text : ''}${react ? ` [\u200b]( "${tweet.id_str}")` : ''}