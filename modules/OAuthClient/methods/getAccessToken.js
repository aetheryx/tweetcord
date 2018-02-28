const url = 'api.twitter.com/oauth/access_token';

async function getAccessToken (oauth_token, oauth_secret, verifier) {
  const OAuthData = this.OAuthClient.signHeaders(
    'POST',
    url, {
      oauth_token,
      oauth_verifier: verifier
    }, oauth_secret).join(', ');

  const res = await this.utils.post({
    url,
    headers: {
      'Authorization': `OAuth ${OAuthData}`
    }
  });

  return this.utils.qs.parse(res);
}

module.exports = getAccessToken;
