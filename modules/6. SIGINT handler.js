const { inspect } = require('util');

async function cleanExit () {
  if (this.config.dev) {
    process.exit();
  }
  this.log('Gracefully exiting...');
  try {
    await this.bot.disconnect({ reconnect: false });
    await this.dbClient.close();
    await this.server.close();
    for (const job of this.jobs) {
      clearInterval(job);
    }
    for (const endStream of this.streams) {
      await endStream();
    }
  } catch (e) {
    this.log(`Unclean exit: ${e.message}`, 'error');
    process.exit(1);
  }
}

async function init () {
  process.on('SIGINT', cleanExit.bind(this));
  process.on('unhandledRejection', err => {
    this.log(`Unhandled rejection: \n${err.stack || err instanceof Object ? inspect(err) : err}`, 'error'); // eslint-disable-line no-console
  });
}

module.exports = init;