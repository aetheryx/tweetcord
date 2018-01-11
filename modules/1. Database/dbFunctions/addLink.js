async function addLink (options) {
  // const timeline = await this.RestClient.getTimeline(options.OAuthAccessToken, options.OAuthAccessSecret);
  // options.latestTweetID = timeline[0] ? timeline[0].id_str : 1;

  return this.dbTables['links'].insertOne(options);
}

module.exports = addLink;