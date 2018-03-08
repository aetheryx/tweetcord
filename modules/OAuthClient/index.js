const methods = require(`${__dirname}/methods`);

module.exports = {
  order: 1,
  func: async function createOAuthClient () {
    const _this = this;

    class OAuthClient {
      constructor () {
        this.keys = _this.config.twitter;
        this.percentEncode = _this.utils.percentEncode;

        for (const method in methods) {
          this[method] = methods[method].bind(_this);
        }
      }

      signHeaders (method, url, props = {}, secret = '') {
        let headers = [];
        for (const prop in props) {
          headers.push([ prop, props[prop] ]);
        }
        headers.push(
          [ 'oauth_callback',         `${_this.config.web.domain}/twitter/cb` ],
          [ 'oauth_consumer_key',     this.keys.APIKey                        ],
          [ 'oauth_nonce',            _this.utils.randomString(32)            ],
          [ 'oauth_timestamp',        (Date.now() / 1000).toFixed()           ],
          [ 'oauth_signature_method', 'HMAC-SHA1'                             ],
          [ 'oauth_version',          '1.0'                                   ]
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
          }).map(([ key, value ]) => `${key}="${value}"`);

        const paramString = this.percentEncode(headers.join('&').replace(/"/g, ''));

        const signature = _this.utils.encrypt.hashHmac(
          `${method.toUpperCase()}&${this.percentEncode(url.startsWith('https://') ? url : `https://${url}`)}&${paramString}`,
          `${this.percentEncode(this.keys.secret)}&${this.percentEncode(secret)}`
        );

        headers.push(`oauth_signature="${this.percentEncode(signature)}"`);
        return headers.filter(h => h.startsWith('oauth'));
      }
    }

    this.OAuthClient = new OAuthClient();
  }
};
