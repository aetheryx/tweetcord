const postMessage = require(`${__dirname}/postMessage.js`);

async function initiateStream (timeline) {
  const link = await this.db.getLink(timeline.userID);
  if (!link) {
    return; // TODO: remove timeline
  }

  let rebuild = true;

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

    this.streams[link.twitterID] = async () => { await r.destroy(); await stream.destroy(); };

    r.on('data', (data) => {
      lastResponse = Date.now();
      data = data.toString();
      if (data === '\r\n') {
        return;
      } else if (
        data === 'Exceeded connection limit for user\r\n' ||
        r.statusCode === 401 ||
        data.includes('"code":6')
      ) {
        rebuild = false;
        return this.streams[link.twitterID]();
      }
      const parsed = parse(data);
      if (parsed) {
        return postMessage.call(this, parsed, timeline, link);
      }
    });

    const checkIntegrity = setInterval(() => {
      if (!rebuild) {
        this.log(`Stopping integrity checks for ${link.name}`);
        // This'll only happen if the user revoked application access
        // in which case we don't need to do integrity checks anymore and the auth tokens will eventually be deleted
        return clearInterval(checkIntegrity);
      }

      // Check for stream integrity periodically, and if something is fucky, rebuild
      if (Date.now() - lastResponse > 60e3) {
        clearInterval(checkIntegrity);
        this.streams[link.twitterID]();
        this.log(`Rebuilding broken stream: ${link.name}`);
        initiateStream.call(this, timeline);
      }
    }, 60e3);
  });
}

module.exports = initiateStream;
