class RestClient {
  constructor (mainClass, { twitter, bot }) {
    this.mainClass = mainClass;
    this.OAuthKey = twitter.APIKey;
    this.OAuthSecret = twitter.secret;
    this.discordToken = bot.token;

    this.BASE_URL = 'https://api.twitter.com/1.1';
  }

  async getTagByID (id) {
    const res = await this.util.get({
      url: `discordapp.com/api/v6/users/${id}`,
      headers: {
        'Authorization': `Bot ${this.mainClass.config.bot.token}`
      }
    });

    return res.status === 200 && `${res.body.username}#${res.body.discriminator}` || null;
  }

  genericPost (endpoint, token, secret, params = {}) {
    return new Promise((resolve, reject) => {
      this.mainClass.OAuthClient.post(
        this.BASE_URL + endpoint,
        token,
        secret,
        params,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            try {
              res = JSON.parse(res);
            } catch (_) {} // eslint-disable-line no-empty
            resolve(res);
          }
        }
      );
    });
  }

  genericGet (endpoint, token, secret) {
    return new Promise((resolve, reject) => {
      this.mainClass.OAuthClient.get(
        this.BASE_URL + endpoint,
        token,
        secret,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            try {
              res = JSON.parse(res);
            } catch (_) { } // eslint-disable-line no-empty
            resolve(res);
          }
        }
      );
    });
  }

  async tweet (token, secret, status) {
    return this.genericPost(
      '/statuses/update.json',
      token,
      secret,
      { status }
    );
  }

  async like (token, secret, id) {
    return this.genericPost(
      '/favorites/create.json',
      token,
      secret,
      { id }
    );
  }

  async unlike (token, secret, id) {
    return this.genericPost(
      '/favorites/destroy.json',
      token,
      secret,
      { id }
    );
  }

  async retweet (token, secret, id) {
    return this.genericPost(
      `/statuses/retweet/${id}.json`,
      token,
      secret
    );
  }

  async unretweet (token, secret, id) {
    return this.genericPost(
      `/statuses/unretweet/${id}.json`,
      token,
      secret
    );
  }

  async getTimeline (token, secret, sinceID = 1, count = 1) {
    return this.genericGet(
      `/statuses/home_timeline.json?count=${count}&since_id=${sinceID}`,
      token,
      secret
    );
  }
}

async function init () {
  this.RestClient = new RestClient(this, this.config);
}

module.exports = init;