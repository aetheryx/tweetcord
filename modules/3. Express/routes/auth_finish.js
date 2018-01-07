async function init () {
  this.app.get('/auth/finish', async (req, res) => {
    res.send(`Your Discord account (ID ${req.session.discordID}, tag sporksmumgay (placeholder)) has been successfully bound with your Twitter account (@${req.session.OAuthAccessResults.screen_name}).
  You can use the bot now.`);
  });
}

module.exports = init;