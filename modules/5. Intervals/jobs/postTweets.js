async function postTweets () {
  // return
  const timelines = await this.db.getAllTimelines();

  for (const timeline of timelines) {
    const link = await this.db.getLink(timeline.userID);
    if (!link) {
      return; // TODO: remove link
    }

    const tweets = (await this.RestClient.getTimeline(link.OAuthAccessToken, link.OAuthAccessSecret, link.latestTweetID, 20))
      .sort((a, b) => {
        const [dateA, dateB] = [a, b].map(tweet => new Date(tweet.created_at).getTime());
        return dateA - dateB;
      });


    for (const tweet of tweets) {
      const hiddenMetadata = `[\u200b]( "${tweet.id_str}|${timeline.userID}")`;

      const msg = await this.bot.sendMessage(timeline.channelID, {
        title: 'New Tweet',
        author: {
          name: `@${tweet.user.name}`,
          url: `https://twitter.com/${tweet.user.screen_name}`,
          icon_url: tweet.user.profile_image_url
        },
        url: `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`,
        description: tweet.text + hiddenMetadata,
        timestamp: new Date(tweet.created_at)
      });
      if (msg) {
        (async () => {
          await msg.addReaction('twitterLike:400076857493684226');
          msg.addReaction('twitterRetweet:400076876430835722');
        })();
      }
    }

    if (tweets[0]) {
      this.dbTables['links'].updateOne(
        { _id: link._id },
        { $set: { latestTweetID: tweets[tweets.length - 1].id_str } }
      );
    }
  }
}

module.exports = {
  func: postTweets,
  interval: 60e3
};