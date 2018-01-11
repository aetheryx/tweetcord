async function init () {
  this.app.get('/auth/finish', async (req, res) => {
    res.status(200).send(`Your Discord account (ID ${req.session.discordID}, tag <code>sporksmumgay</code> has been successfully bound with your Twitter account (@${req.session.name}).
  You can use the bot now.`);
  });
}

module.exports = init;