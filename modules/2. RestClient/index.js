class RestClient {
  constructor (mainClass, { twitter, bot }) {
    this.mainClass = mainClass;
    this.OAuthKey = twitter.APIKey;
    this.OAuthSecret = twitter.secret;
    this.discordToken = bot.token;

    this.BASE_URL = 'api.twitter.com/1.1';
  }

  async getTagByID (id) {
    const cachedUser = this.mainClass.bot.users.get(id);
    if (cachedUser) {
      return `${cachedUser.username}#${cachedUser.discriminator}`;
    }
    const res = await this.mainClass.utils.get({
      url: `discordapp.com/api/v6/users/${id}`,
      headers: {
        'Authorization': `Bot ${this.mainClass.config.bot.token}`
      }
    });

    if (res.username) {
      return `${res.username}#${res.discriminator}`;
    } else {
      throw res;
    }
  }

  async streamTweets (endpoint, secret, qs = '', params = {}) {
    const url = 'userstream.twitter.com/1.1' + endpoint;
    const OAuthData = this.mainClass.OAuthClient.signHeaders('POST', url, params, secret).join(',');

    const res = await this.mainClass.utils.post({
      url: url + qs,
      headers: {
        'Authorization': `OAuth ${OAuthData}`,
        'User-Agent': 'aetheryx',
        'content-length': '0'
      }
    });

    if (res.error || res.errors) {
      throw res;
    }

    
    return res;
  }

  async genericPost (endpoint, secret, qs = '', params = {}) {
    const url = this.BASE_URL + endpoint;
    const OAuthData = this.mainClass.OAuthClient.signHeaders('POST', url, params, secret).join(',');

    const res = await this.mainClass.utils.post({
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
    const qs = this.mainClass.utils.qs.create(qsData);

    const OAuthData = this.mainClass.OAuthClient.signHeaders('GET', url, params, secret).join(', ');

    const res = await this.mainClass.utils.get({
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
      this.mainClass.utils.qs.create({ status }),
      { oauth_token: token, status }
    );
  }

  async like (token, secret, id) {
    return this.genericPost(
      '/favorites/create.json',
      secret,
      this.mainClass.utils.qs.create({ id }),
      { oauth_token: token, id }
    );
  }

  async unlike (token, secret, id) {
    return this.genericPost(
      '/favorites/destroy.json',
      secret,
      this.mainClass.utils.qs.create({ id }),
      { oauth_token: token, id }
    );
  }

  async retweet (token, secret, id) {
    return this.genericPost(
      `/statuses/retweet/${id}.json`,
      secret,
      this.mainClass.utils.qs.create({ id }),
      { oauth_token: token, id }
    );
  }

  async unretweet (token, secret, id) {
    return this.genericPost(
      `/statuses/unretweet/${id}.json`,
      secret,
      this.mainClass.utils.qs.create({ id }),
      { oauth_token: token, id }
    );
  }
}

async function init () {
  this.RestClient = new RestClient(this, this.config);
}

module.exports = init;