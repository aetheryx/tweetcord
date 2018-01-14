async function init () {
  this.app.get('/link', async (req, res) => {
    if (!req.query.id) {
      return res.status(400).send('Missing ID querystring');
    }

    const tag = await this.RestClient.getTagByID(req.query.id);
    if (!tag) {
      return res.status(404).send('ID not found');
    }
    res.render('link', { id: req.query.id, tag });
  });
}

module.exports = init;