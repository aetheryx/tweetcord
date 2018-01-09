const { OAuth } = require('oauth');

async function init () {
  const OAuthClient = new OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    this.config.twitter.APIKey,
    this.config.twitter.secret,
    '1.0A',
    `${this.config.web.domain || 'http://localhost:42069'}/auth/callback`,
    this.config.signSignature || 'HMAC-SHA1'
  );

  this.OAuthClient = OAuthClient;
}

module.exports = init;