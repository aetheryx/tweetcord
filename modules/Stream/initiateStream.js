const postMessage = require(`${__dirname}/postMessage.js`);

async function initiateStream (timeline) {
  const link = await this.db.getLink(timeline.userID);
  if (!link) {
    return; // TODO: remove link
  }

  const stream = await this.RestClient.createTweetStream(
    link.OAuthAccessToken,
    link.OAuthAccessSecret,
    true
  );

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
      if (data === '\r\n' || data.startsWith('{"friends')) { // Ignore keep-alives.
        return;
      }
      const parsed = parse(data);
      if (parsed) {
        return postMessage.call(this, parsed, timeline, link);
      }
    });
    this.streams.push(() => { r.destroy(); stream.destroy(); });
  });
}

module.exports = initiateStream;