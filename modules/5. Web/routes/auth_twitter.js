async function init () {
  this.app.get('/auth/twitter', async (req, res) => {
    const token = await this.OAuthClient.getRequestToken()
      .catch(err => {
        return res.status(500).send(`Error getting OAuth request token: ${err.message || err}`);
      });
    if (token.oauth_token) {
      req.session.OAuthToken = token.oauth_token;
      req.session.OAuthSecret = token.oauth_token_secret;
      req.session.discordID = req.query.id;

      res.redirect(`https://twitter.com/oauth/authorize?oauth_token=${token.oauth_token}`);
    }
  });
}

module.exports = init;