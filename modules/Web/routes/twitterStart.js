async function init () {
  this.app.get('/twitter/start', async (req, res) => {
    if (!req.session.user) {
      return res.status(412).send(`No user profile found in session. Start at <a href="/link">${this.config.web.domain}/link<a>.<br>If the issue persists, please join <a href="https://discord.gg/Yphr6WG">Tweetcord's support server</a> for assistance.`);
    }

    const consumerKeys = await this.OAuthClient.getRequestToken()
      .catch(err => {
        return res.status(500).send(`Error getting OAuth request token: ${err.message || err}`);
      });

    if (!consumerKeys.oauth_token) {
      return res.status(500).send('Something went wrong.<br>If the issue persists, please join <a href="https://discord.gg/Yphr6WG">Tweetcord\'s support server</a> for assistance.');
    }

    req.session.consumer_token  = consumerKeys.oauth_token;
    req.session.consumer_secret = consumerKeys.oauth_token_secret;

    res.redirect(`https://twitter.com/oauth/authorize?oauth_token=${consumerKeys.oauth_token}`);
  });
}

module.exports = init;
