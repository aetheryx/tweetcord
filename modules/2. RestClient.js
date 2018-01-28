async function init () {
  const _this = this;

  class RestClient {
    constructor () {
      this.OAuthKey = _this.config.twitter.APIKey;
      this.OAuthSecret = _this.config.twitter.secret;

      this.BASE_URL = 'api.twitter.com/1.1/';
      this.STREAM_URL = 'userstream.twitter.com/1.1/user.json';

      this.buildRoutes();
    }

    buildRoutes () {
      const routes = {
        'tweet': 'statuses/update.json',
        'like': 'favorites/create.json',
        'unlike': 'favorites/destroy.json',
        'retweet': 'statuses/retweet/:id.json',
        'unretweet': 'statuses/unretweet/:id.json'
      };

      for (const route in routes) {
        this[route] = async (token, secret, params) => {
          let url = routes[route];
          for (const param in params) {
            if (url.includes(`:${param}`)) {
              url = url.replace(`:${param}`, params[param]);
            }
          }

          return this.genericPost(
            url,
            secret,
            _this.utils.qs.create(params),
            Object.assign({ oauth_token: token }, params)
          );
        };
      }
    }

    async getTagByID (id) {
      const cachedUser = _this.bot.users.get(id);
      if (cachedUser) {
        return `${cachedUser.username}#${cachedUser.discriminator}`;
      }
      const res = await _this.utils.get({
        url: `discordapp.com/api/v6/users/${id}`,
        headers: {
          'Authorization': _this.bot.token
        }
      });

      if (res.username) {
        return `${res.username}#${res.discriminator}`;
      } else {
        throw res;
      }
    }

    async createTweetStream (token, secret, withFollowers) {
      withFollowers = withFollowers
        ? { with: 'followings' }
        : { with: 'user' };
      const OAuthData = _this.OAuthClient.signHeaders(
        'POST',
        this.STREAM_URL,
        Object.assign(withFollowers, { oauth_token: token }),
        secret
      ).join(',');

      const res = await _this.utils.post({
        url: this.STREAM_URL + _this.utils.qs.create(withFollowers),
        headers: {
          'Authorization': `OAuth ${OAuthData}`,
          'User-Agent': 'Tweetcord (github.com/aetheryx/tweetcord)',
          'Content-Length': '0'
        }
      }, '', true);

      if (res.error || res.errors) {
        throw res;
      }

      return res;
    }

    async genericPost (endpoint, secret, qs = '', params = {}) {
      const url = this.BASE_URL + endpoint;
      const OAuthData = _this.OAuthClient.signHeaders('POST', url, params, secret).join(',');

      const res = await _this.utils.post({
        url: url + qs,
        headers: {
          'Authorization': `OAuth ${OAuthData}`
        }
      });

      if (res.error || res.errors) {
        throw res;
      }

      return res;
    }
  }

  this.RestClient = new RestClient();
}

module.exports = init;