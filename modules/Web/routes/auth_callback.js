async function init () {
  this.app.get('/auth/callback', async (req, res) => {
    const token = await this.OAuthClient.getAccessToken(
      req.session.consumer_token,
      req.session.consumer_secret,
      req.query.oauth_verifier
    ).catch(err => {
      return res.status(500).send(`Error getting OAuth access token: ${err.message || err}`);
    });

    if (await this.db.getLink(req.session.discordID)) {
      res.status(409).send('This Discord account is already linked. Please run <code>t/unlink</code> to unlink the account first.');
    } else if (token) {
      await this.db.addLink({
        oauth_token: token.oauth_token,
        oauth_secret: token.oauth_token_secret,
        discordID: req.session.discordID,
        twitterID: token.user_id,
        name: token.screen_name
      });

      req.session.name = token.screen_name;
      res.redirect('/auth/finish');
    }
  });
}

module.exports = init;