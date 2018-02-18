const { request } = require('https');

function get (options) {
  return new Promise((resolve, reject) => {
    const url = options.url.replace('https://', '').split('/');
    options = Object.assign({
      hostname: url.shift(),
      headers: Object.assign({ 'User-Agent': 'Tweetcord (https://github.com/aetheryx/tweetcord)' }, options.headers),
      path: `/${url.join('/')}`
    }, options);

    let output = [];

    const req = request(options, (res) => {
      res.on('data', (chunk) => {
        output.push(chunk);
      });

      res.on('end', () => {
        output = Buffer.concat(output);
        try {
          output = JSON.parse(output);
        } catch (_) { } // eslint-disable-line no-empty
        resolve(output);
      });
    });

    req.on('error', reject);

    req.end();
  });
}

module.exports = get;