async function init () {
  let stats = {};
  const refreshStats = async () => {
    stats = {
      'Guilds': this.bot.guilds.size,
      'Linked users': await this.dbTables.links.find({}).toArray().then(_ => _.length),
      'Streams': await this.dbTables.links.find({}).toArray().then(_ => _.length)
    };
  };
  refreshStats();
  setInterval(refreshStats, 30000, this);

  this.app.get('/stats', async (req, res) => {
    res.json(stats);
  });
}

module.exports = init;
