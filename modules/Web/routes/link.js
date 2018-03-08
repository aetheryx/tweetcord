async function init () {
  this.app.get('/link', async (req, res) => {
    res.redirect(`https://discordapp.com/oauth2/authorize?response_type=code&scope=identify&client_id=${this.bot.user.id}&redirect_uri=${encodeURIComponent(`${this.config.web.domain}/discord/cb`)}`);
  });
}

module.exports = init;
