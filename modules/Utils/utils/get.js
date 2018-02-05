const { request } = require('https');

function get (options) {
  return new Promise((resolve, reject) => {
    const url = options.url.split('/');
    options = Object.assign({
      hostname: url.shift(),
      headers: Object.assign({ 'User-Agent': 'Tweetcord (https://github.com/aetheryx/tweetcord)' }, options.headers),
      path: `/${url.join('/')}`
    }, options);

    let output = '';

    const req = request(options, (res) => {
      res.on('data', (chunk) => {
        output += chunk;
      });

      res.on('end', () => {
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