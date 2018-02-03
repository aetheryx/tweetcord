const initiateStream = require(`${__dirname}/initiateStream.js`);

module.exports = {
  order: 5,
  func: async function createStreams () {
    this.streams = [];
    const timelines = await this.db.getAllTimelines();

    for (const timeline of timelines) {
      initiateStream.call(this, timeline);
    }
  }
}