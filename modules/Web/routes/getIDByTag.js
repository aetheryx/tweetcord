async function init () {
  this.app.get('/getIDByTag', async (req, res) => {
    const result = this.bot.users.find(u => `${u.username}#${u.discriminator}` === req.headers.tag);
    if (!result) {
      res.status(404).send('404');
    } else {
      res.status(200).send(result.id);
    }
  });
}

module.exports = init;
