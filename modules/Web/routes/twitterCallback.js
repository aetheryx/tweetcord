async function init () {
  this.app.get('/twitter/cb', async (req, res) => {
    const token = await this.OAuthClient.getAccessToken(
      req.session.consumer_token,
      req.session.consumer_secret,
      req.query.oauth_verifier
    ).catch(err => {
      return res.status(500).send(`Error getting OAuth access token: ${err.message || err}`);
    });

    req.session.twitterName = token.screen_name;

    await this.db.addLink({
      oauth_token: token.oauth_token,
      oauth_secret: token.oauth_token_secret,
      discordID: req.session.user.id,
      twitterID: token.user_id,
      name: token.screen_name
    });

    res.redirect('/finishLink');
  });
}

module.exports = init;
