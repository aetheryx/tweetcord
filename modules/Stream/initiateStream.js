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
    let lastResponse = { time: -1, content: '' };
    const parse = (chunk) => {
      currentMessage += chunk;
      chunk = currentMessage;
      if (chunk.endsWith('\r\n')) {
        currentMessage = '';
        try {
          chunk = JSON.parse(chunk);
        } catch (_) {
          // Probably corrupt JSON. We log it to make sure:
          this.log(`Failed to parse JSON: ${chunk}`);
        }
        return chunk;
      }
    };

    r.on('data', (data) => {
      data = data.toString();

      lastResponse.time = Date.now();
      lastResponse.content = data;
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

    const checkIntegrity = setInterval(async () => {
      if (!rebuild) {
        // This'll only happen if the user revoked application access
        // in which case we don't need to do integrity checks anymore and the auth tokens will eventually be deleted
        this.log(`Stopping integrity checks for ${link.name} | Content: ${lastResponse.content}`);
        if (this.streams[link.twitterID]) {
          await this.streams[link.twitterID]();
        }
        return clearInterval(checkIntegrity);
      }

      // Check for stream integrity periodically, and if something is fucky, rebuild
      if (Date.now() - lastResponse.time > 60e3) {
        clearInterval(checkIntegrity);
        await this.streams[link.twitterID]();
        initiateStream.call(this, timeline);
      }
    }, 60e3);

    this.streams[link.twitterID] = () => Promise.all([
      r.destroy(),
      stream.destroy(),
      clearInterval(checkIntegrity)
    ]);
  });
}

module.exports = initiateStream;
