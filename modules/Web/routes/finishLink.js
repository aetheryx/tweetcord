async function init () {
  this.app.get('/finishLink', async (req, res) => {
    if (!req.session.user || !req.session.twitterName) {
      return res.status(412).send(`No user profile found in session. Start at <a href="/link">${this.config.web.domain}/link<a>.<br>If the issue persists, please join <a href="https://discord.gg/Yphr6WG">Tweetcord's support server</a> for assistance.`);
    }

    res.status(200).send(`Your Discord account (<code>${req.session.user.username}#${req.session.user.discriminator}</code>) has been successfully bound with your Twitter account (<code>@${req.session.twitterName}</code>).
  You can use the bot now.`);
  });
}

module.exports = init;
