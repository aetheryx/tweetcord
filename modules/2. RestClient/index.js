

async function init () {
  const _this = this;

  class RestClient {
    constructor () {
      this.OAuthKey = _this.config.twitter.APIKey;
      this.OAuthSecret = _this.config.twitter.secret;

      this.BASE_URL = 'api.twitter.com/1.1';
      this.STREAM_URL = 'userstream.twitter.com/1.1/user.json';
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

    async createTweetStream (token, secret) {
      const OAuthData = _this.OAuthClient.signHeaders('POST', this.STREAM_URL, { oauth_token: token, with: 'followings' }, secret).join(',');

      const res = await _this.utils.post({
        url: this.STREAM_URL + '?with=followings',
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

    async genericGet (endpoint, secret, qsData, params) {
      const url = this.BASE_URL + endpoint;
      const qs = _this.utils.qs.create(qsData);
  
      const OAuthData = _this.OAuthClient.signHeaders('GET', url, params, secret).join(', ');
  
      const res = await _this.utils.get({
        url: url + qs,
        headers: {
          'Authorization': `OAuth ${OAuthData}`
        }
      });
  
      if (res.errors || res.error) {
        throw res;
      }
  
      return res;
    }
  
    async getTimeline (token, secret, since_id = 1, count = 1) {
      return this.genericGet(
        '/statuses/home_timeline.json',
        secret,
        { count, since_id },
        { oauth_token: token, count, since_id }
      );
    }
  
    async tweet (token, secret, status) {
      return this.genericPost(
        '/statuses/update.json',
        secret,
        _this.utils.qs.create({ status }),
        { oauth_token: token, status }
      );
    }
  
    async like (token, secret, id) {
      return this.genericPost(
        '/favorites/create.json',
        secret,
        _this.utils.qs.create({ id }),
        { oauth_token: token, id }
      );
    }
  
    async unlike (token, secret, id) {
      return this.genericPost(
        '/favorites/destroy.json',
        secret,
        _this.utils.qs.create({ id }),
        { oauth_token: token, id }
      );
    }
  
    async retweet (token, secret, id) {
      return this.genericPost(
        `/statuses/retweet/${id}.json`,
        secret,
        _this.utils.qs.create({ id }),
        { oauth_token: token, id }
      );
    }
  
    async unretweet (token, secret, id) {
      return this.genericPost(
        `/statuses/unretweet/${id}.json`,
        secret,
        _this.utils.qs.create({ id }),
        { oauth_token: token, id }
      );
    }
  }

  this.RestClient = new RestClient();
}

module.exports = init;