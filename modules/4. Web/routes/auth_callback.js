async function init () {
  this.app.get('/auth/callback', async (req, res) => {
    const token = await this.OAuthClient.getAccessToken(
      req.session.OAuthToken,
      req.session.OAuthSecret,
      req.query.oauth_verifier
    ).catch(err => {
      return res.status(500).send(`Error getting OAuth access token: ${err.message || err}`);
    });

    if (token) {
      await this.db.addLink({
        id: req.session.discordID,
        OAuthAccessToken: token.oauth_token,
        OAuthAccessSecret: token.oauth_token_secret,
        name: token.screen_name,
        twitterID: token.user_id
      });

      req.session.name = token.screen_name;
      res.redirect('/auth/finish');
    }
  });
}

module.exports = init;