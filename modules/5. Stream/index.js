const initiateStream = require(`${__dirname}/initiateStream.js`);

async function init () {
  this.streams = [];
  const timelines = await this.db.getAllTimelines();

  for (const timeline of timelines) {
    initiateStream.call(this, timeline);
  }
}

module.exports = init;
