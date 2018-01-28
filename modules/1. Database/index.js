const { MongoClient } = require('mongodb');
const dbFunctions = require(`${__dirname}/dbFunctions`);

async function init () {
  this.dbClient = await MongoClient.connect(this.config.dbURL || 'mongodb://localhost:27017')
    .catch(e => {
      this.log(`Failed to connect to MongoDB: ${e.message}\nExiting...`, 'error');
      process.exit();
    });

  this.dbConn = this.dbClient.db('tweetcord');

  this.dbTables = {};
  for (const table of ['prefixes', 'links', 'timelines']) {
    this.dbTables[table] = this.dbConn.collection(table);
  }

  this.db = {};
  for (const dbFunction in dbFunctions) {
    this.db[dbFunction] = dbFunctions[dbFunction].bind(this);
  }
}

module.exports = init;