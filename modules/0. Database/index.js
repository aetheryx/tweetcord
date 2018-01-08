const { MongoClient } = require('mongodb');
const dbFunctions = require(`${__dirname}/dbFunctions`);

function init () {
  MongoClient.connect(this.config.dbURL || 'mongodb://localhost:27017')
    .then(dbClient => {
      this.dbClient = dbClient;
      this.dbConn = dbClient.db('tweetcord');

      this.dbTables = {
        'prefixes': this.dbConn.collection('prefixes'),
        'links': this.dbConn.collection('links')
      };

      this.db = {};
      for (const dbFunction in dbFunctions) {
        this.db[dbFunction] = dbFunctions[dbFunction].bind(this);
      }
    })
    // .catch(e => {
    //   this.log(`Failed to connect to MongoDB: ${e.message}\nExiting...`, 'error');
    //   process.exit();
    // });
}

module.exports = init;