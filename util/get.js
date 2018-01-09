const https = require('https');

function get (options) {
  return new Promise((resolve, reject) => {
    const url = options.url.split('/');
    options = Object.assign({
      hostname: url.shift(),
      path: `/${url.join('/')}`
    }, options);

    const output = { body: '' };

    const req = https.request(options, (res) => {
      output.status = res.statusCode;
      output.headers = res.headers;

      res.on('data', (chunk) => {
        output.body += chunk;
      });

      res.on('end', () => {
        if (output.body.startsWith('{')) {
          try {
            output.body = JSON.parse(output.body);
          } catch (_) { } // eslint-disable-line no-empty
        }
        resolve(output);
      });
    });

    req.on('error', reject);

    req.end();
  });
}

module.exports = get;