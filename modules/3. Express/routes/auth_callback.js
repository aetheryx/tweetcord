async function init () {
  this.app.get('/auth/callback', async (req, res) => {
    this.OAuthClient.getOAuthAccessToken(
      req.session.OAuthToken,
      req.session.OAuthSecret,
      req.query.oauth_verifier,
      (err, OAuthAccessToken, OAuthAccessSecret, results) => {
        if (err) {
          res.send(`Error getting OAuth2 access token: ${err.message}`, 500);
        } else {
          req.session.OAuthAccessToken = OAuthAccessToken;
          req.session.OAuthAccessSecret = OAuthAccessSecret;
          req.session.OAuthAccessResults = results;

          res.redirect('/auth/finish');
        }
      });
  });
}

module.exports = init;