async function init () {
  this.app.get('/discord/cb', async (req, res) => {
    if (!req.query.code) {
      return res.status(400).send('Missing code querystring');
    }

    const bearer = await this.RestClient.getBearer(req.query.code);
    if (bearer.error) {
      return res.status(500).send(`Something went wrong: <code>${bearer.error}</code><br>If the issue persists, please join <a href="https://discord.gg/Yphr6WG">Tweetcord's support server</a> for assistance.`);
    }

    const user = await this.RestClient.getUserByBearer(bearer.access_token);
    if (!user.id) {
      return res.status(500).send(`Something went wrong: <code>${user.message}</code><br>If the issue persists, please join <a href="https://discord.gg/Yphr6WG">Tweetcord's support server</a> for assistance.`);
    }
    if (await this.db.getLink(user.id)) {
      res.status(409).send(`This Discord account is already linked. Please run the <code>unlink</code> command to unlink the account first.`);
    }
    req.session.user = user;

    res.redirect('/twitter/start');
  });
}

module.exports = init;
