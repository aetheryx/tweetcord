async function init () {
  this.app.get('/auth/twitter', async (req, res) => {
    this.OAuthClient.getOAuthRequestToken((err, OAuthToken, OAuthSecret) => {
      if (err) {
        res.send(`Error getting OAuth2 request token: ${err.message}`, 500);
      } else {
        req.session.OAuthToken = OAuthToken;
        req.session.OAuthSecret = OAuthSecret;
        req.session.discordID = req.query.id;

        res.redirect(`https://twitter.com/oauth/authorize?oauth_token=${OAuthToken}`);
      }
    });
  });
}

module.exports = init;