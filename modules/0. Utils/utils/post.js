const { request } = require('https');

function post (options, body = '') {
  return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
    try {
      const data = JSON.stringify(body);

      const url = options.url.split('/');
      const postOptions = Object.assign({
        hostname: url.shift(),
        path: `/${url.join('/')}`,
        method: 'POST',
        headers: {}
      }, options);

      let output = '';

      const req = request(postOptions, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          output += chunk;
        });
        res.on('end', () => {
          try {
            output = JSON.parse(output);
          } catch (_) {} // eslint-disable-line no-empty
          resolve(output);
        });
      });

      req.on('error', (err) => {
        reject(err);
      });

      req.write(data);
      req.end();
    } catch (err) {
      reject (err);
    }
  });
}

module.exports = post;