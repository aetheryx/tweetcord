async function init () {
  this.app.get('/auth/finish', async (req, res) => {
    res.send(`Your Discord account (tag ${(await this.bot.fetchUser(req.session.discordID)).tag}) has been successfully bound with your Twitter account (@${req.session.OAuthAccessResults.screen_name}).
  You can use the bot now.`);
  });
}

module.exports = init;