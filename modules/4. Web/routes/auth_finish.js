async function init () {
  this.app.get('/auth/finish', async (req, res) => {
    res.status(200).send(`Your Discord account (ID ${req.session.discordID}, tag <code>${this.RestClient.getTagByID(req.session.discordID)}</code> has been successfully bound with your Twitter account (<code>@${req.session.name}<code>).
  You can use the bot now.`);
  });
}

module.exports = init;