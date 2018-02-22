const postMessage = require(`${__dirname}/postMessage.js`);

async function initiateStream (timeline) {
  const link = await this.db.getLink(timeline.userID);
  if (!link) {
    return; // TODO: remove timeline
  }

  const stream = await this.RestClient.createTweetStream(link, !timeline.isUserStream);

  stream.on('response', (r) => {
    let currentMessage = '';
    let lastResponse = -1;
    const parse = (chunk) => {
      currentMessage += chunk;
      chunk = currentMessage;
      if (chunk.endsWith('\r\n')) {
        currentMessage = '';
        return JSON.parse(chunk);
      }
    };

    r.on('data', (data) => {
      lastResponse = Date.now();
      data = data.toString();
      if (
        data === '\r\n' || // Ignore keep-alives
        data === 'Exceeded connection limit for user\r\n'
      ) {
        return;
      }
      const parsed = parse(data);
      if (parsed) {
        return postMessage.call(this, parsed, timeline, link);
      }
    });

    this.streams[link.twitterID] = async () => { await r.destroy(); await stream.destroy(); };

    const checkIntegrity = setInterval(() => {
      // Check for stream integrity periodically, and if something is fucky, rebuild
      if (Date.now() - lastResponse > 60e3) {
        clearInterval(checkIntegrity);
        this.streams[link.twitterID]();
        this.log(`Rebuilding broken stream: ${link.name}`);
        initiateStream.call(this, timeline);
      }
    }, 15e3);
  });
}

module.exports = initiateStream;