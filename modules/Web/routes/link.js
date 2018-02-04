async function init () {
  this.app.get('/link', async (req, res) => {
    const tag = req.query.id ? await this.RestClient.getTagByID(req.query.id) : 'username#discriminator';
    res.render('link', { id: req.query.id, tag });
  });
}

module.exports = init;