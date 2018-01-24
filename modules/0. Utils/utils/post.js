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

      console.log(postOptions);

      let output = '';

      const req = request(postOptions, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          output += chunk;
        });
        res.on('end', () => {
          try {
            output = JSON.parse(output);
            console.log(output);
          } catch (_) {} // eslint-disable-line no-empty
          resolve(output);
        });
      });

      req.on('error', (err) => {
        reject(err);
      });

     
      !options.url.includes('tweet') && req.on('response', (r) => {
        let f = '';
        r.on('data', (c) => { f += c.toString() });
        r.on('end', () => {
          console.log(f);
        })
      });


      req.write(data);
      req.end();
    } catch (err) {
      reject (err);
    }
  });
}

module.exports = post;