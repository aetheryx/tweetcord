const url = 'api.twitter.com/oauth/request_token';

async function getRequestToken () {
  const OAuthData = this.OAuthClient.signHeaders('POST', url).join(', ');


  const res = await this.utils.post({
    url,
    headers: {
      'Authorization':  `OAuth ${OAuthData}` }
  });

  return this.utils.qs.parse(res);
}

module.exports = getRequestToken;