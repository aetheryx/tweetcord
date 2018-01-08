async function init () {
  this.app.get('/auth/callback', async (req, res) => {
    this.OAuthClient.getOAuthAccessToken(
      req.session.OAuthToken,
      req.session.OAuthSecret,
      req.query.oauth_verifier,
      async (err, OAuthAccessToken, OAuthAccessSecret, results) => {
        if (err) {
          res.status(500).send(`Error getting OAuth2 access token: ${err.message}`);
        } else {
          req.session.OAuthAccessToken = OAuthAccessToken;
          req.session.OAuthAccessSecret = OAuthAccessSecret;
          req.session.OAuthAccessResults = results;

          await this.db.addLink({ id: req.session.discordID, OAuthAccessToken, OAuthAccessSecret, name: results.screen_name });

          res.redirect('/auth/finish');
        }
      });
  });
}

module.exports = init;