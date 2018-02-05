const postMessage = require(`${__dirname}/postMessage.js`);

async function initiateStream (timeline) {
  const link = await this.db.getLink(timeline.userID);
  if (!link) {
    return; // TODO: remove timeline
  }

  const stream = await this.RestClient.createTweetStream(link, !timeline.isUserStream);

  stream.on('response', (r) => {
    let currentMessage = '';
    const parse = (chunk) => {
      currentMessage += chunk;
      chunk = currentMessage;
      if (chunk.endsWith('\r\n')) {
        currentMessage = '';
        return JSON.parse(chunk);
      }
    };

    r.on('data', (data) => {
      data = data.toString();
      if (
        data === '\r\n' || // Ignore keep-alives
        data.startsWith('{"friends') ||
        data === 'Exceeded connection limit for user\r\n'
      ) {
        return;
      }
      const parsed = parse(data);
      if (parsed) {
        return postMessage.call(this, parsed, timeline, link);
      }
    });
    this.streams[link.twitterID] = async () => { r.destroy(); stream.destroy(); };
  });
}

module.exports = initiateStream;