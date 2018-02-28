async function postStats () {
  for (const botlist of this.config.bot.botlists) {
    this.utils.post({
      url: botlist.url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': botlist.token
      }
    }, { server_count: this.bot.guilds.size });
  }
}

module.exports = {
  func: postStats,
  interval: 60e3
};
