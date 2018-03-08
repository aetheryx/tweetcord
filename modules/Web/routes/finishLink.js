async function init () {
  this.app.get('/finishLink', async (req, res) => {
    if (!req.session.user.username || !req.session.twitterName) {
      return res.status(500).send('Something went wrong.<br>If the issue persists, please join <a href="https://discord.gg/Yphr6WG">Tweetcord\'s support server</a> for assistance.');
    }

    res.status(200).send(`Your Discord account (<code>${req.session.user.username}#${req.session.user.discriminator}</code>) has been successfully bound with your Twitter account (<code>@${req.session.twitterName}</code>).
  You can use the bot now.`);
  });
}

module.exports = init;
