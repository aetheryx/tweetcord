const methods = require(`${__dirname}/methods`);

class OAuthClient {
  constructor (mainClass) {
    this.mainClass = mainClass;
    this.keys = mainClass.config.twitter;
    this.percentEncode = mainClass.utils.percentEncode;

    for (const method in methods) {
      this[method] = methods[method].bind(mainClass);
    }
  }

  signHeaders (method, url, props = {}, secret = '') {
    this.mainClass.log(url);
    let headers = [];
    for (const prop in props) {
      headers.push([ prop, props[prop] ]);
    }
    headers.push(
      [ 'oauth_callback', `${this.mainClass.config.web.domain}/auth/callback` ],
      [ 'oauth_consumer_key', this.keys.APIKey ],
      [ 'oauth_nonce', this.mainClass.utils.randomString(32) ],
      [ 'oauth_timestamp', (Date.now() / 1000).toFixed() ],
      [ 'oauth_signature_method', 'HMAC-SHA1' ],
      [ 'oauth_version', '1.0' ]
    );
    headers = headers
      .map(header => header.map(this.percentEncode))
      .sort((a, b) => {
        if (a[0] < b[0]) {
          return -1;
        } else if (a[0] > b[0]) {
          return 1;
        } else {
          return 0;
        }
      }).map(header => `${header[0]}="${header[1]}"`);

    const paramString = this.percentEncode(headers.join('&').replace(/"/g, ''));

    const signature = this.mainClass.utils.encrypt.hashHmac(
      `${method.toUpperCase()}&${this.percentEncode(url.startsWith('https://') ? url : `https://${url}`)}&${paramString}`,
      `${this.percentEncode(this.keys.secret)}&${this.percentEncode(secret)}`
    );

    headers.push(`oauth_signature="${this.percentEncode(signature)}"`);
    return headers.filter(h => h.startsWith('oauth'));
  }
}

module.exports = OAuthClient;

async function init () {
  this.OAuthClient = new OAuthClient(this);
}

module.exports = init;
