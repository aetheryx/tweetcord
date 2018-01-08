async function postTweets () {
  console.log('cron ran');
  const timelines = await this.db.getAllTimelines();

  for (const timeline of timelines) {
    const link = await this.db.getLink(timeline.userID);
    if (!link) {
      return; // TODO: remove link
    }

    const tweets = (await this.RestClient.getTimeline(link.OAuthAccessToken, link.OAuthAccessSecret, link.latestTweetID, 20).catch(console.log))
      .sort((a, b) => {
        const [dateA, dateB] = [a, b].map(tweet => new Date(tweet.created_at).getTime());
        return dateA - dateB;
      });

    for (const tweet of tweets) {
      this.bot.sendMessage(timeline.channelID, {
        title: 'New Tweet',
        author: {
          name: `@${tweet.user.name}`,
          url: `https://twitter.com/${tweet.user.screen_name}`,
          icon_url: tweet.user.profile_image_url
        },
        url: `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`,
        description: tweet.text,
        timestamp: new Date(tweet.created_at)
      });
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