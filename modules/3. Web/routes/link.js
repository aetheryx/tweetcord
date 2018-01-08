async function init () {
  this.app.get('/link', async (req, res) => {
    res.render('link', { id: req.query.id, tag: await this.RestClient.getTagById(req.query.id) });
  });
}

module.exports = init;