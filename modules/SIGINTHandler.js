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
    for (const stream in this.streams) {
      await this.streams[stream](); // this.streams is an object of functions that destroy the stream
    }
    process.nextTick(process.exit);
  } catch (e) {
    this.log(`Unclean exit: ${e.message}`, 'error');
    process.exit(1);
  }
}

module.exports = {
  order: 6,
  func: async function hookEvents () {
    this.gracefulExit = cleanExit.bind(this);
    process.on('SIGINT', this.gracefulExit);
    process.on('unhandledRejection', err => {
      this.log(`Unhandled rejection: \n${err.stack || err instanceof Object ? inspect(err) : err}`, 'error'); // eslint-disable-line no-console
    });
  }
};
