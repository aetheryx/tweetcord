const { inspect } = require('util');

async function cleanExit () {
  if (this.config.dev) {
    process.exit();
  }
  this.log('Gracefully exiting...') 
  try {
    await this.bot.disconnect({ reconnect: false });
    await this.dbClient.close();
    await this.server.close();
    for (const job of this.jobs) {
      clearInterval(job);
    }
  } catch (_) {} // eslint-disable-line no-empty
}

async function init () {
  process.on('SIGINT', cleanExit.bind(this));
  process.on('unhandledRejection', err => {
    this.log(`Unhandled rejection: \n${err.stack || err instanceof Object ? inspect(err) : err}`, 'error'); // eslint-disable-line no-console
  });
}

module.exports = init;