async function init () {
  this.app.get('/auth/twitter', async (req, res) => {
    const consumerKeys = await this.OAuthClient.getRequestToken()
      .catch(err => {
        return res.status(500).send(`Error getting OAuth request token: ${err.message || err}`);
      });

    if (consumerKeys.oauth_token) {
      if (!await this.RestClient.getTagByID(req.query.id)) {
        return res.status(404).send('ID not found');
      }
      req.session.consumer_token =  consumerKeys.oauth_token;
      req.session.consumer_secret = consumerKeys.oauth_token_secret;
      req.session.discordID = req.query.id;

      res.redirect(`https://twitter.com/oauth/authorize?oauth_token=${consumerKeys.oauth_token}`);
    }
  });
}

module.exports = init;
