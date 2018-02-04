async function init () {
  this.app.get('/', async (req, res) => {
    res.render('index');
  });
}

module.exports = init;