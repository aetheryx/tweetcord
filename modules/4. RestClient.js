const https = require('https');

function get (options) {
  const url = options.url.split('/');
  options = Object.assign({
    hostname: url.shift(),
    path: `/${url.join('/')}`
  }, options);

  const output = { body: '' };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      output.status = res.statusCode;
      output.headers = res.headers;

      res.on('data', (chunk) => {
        output.body += chunk;
      });

      res.on('end', () => {
        if (output.body.startsWith('{')) {
          try {
            output.body = JSON.parse(output.body);
          } catch (_) {} // eslint-disable-line no-empty
        }
        resolve(output);
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.end();
  });
}

class RestClient {
  constructor (mainClass, { twitter, bot }) {
    this.mainClass = mainClass;
    this.OAuthKey = twitter.APIKey;
    this.OAuthSecret = twitter.secret;
    this.discordToken = bot.token;
  }

  async getTagByID (id) {
    const res = await get({
      url: `discordapp.com/api/v6/users/${id}`,
      headers: {
        'Authorization': `Bot ${this.mainClass.config.bot.token}`
      }
    });

    return res.status === 200 && `${res.body.username}#${res.body.discriminator}` || null;
  }

  tweet (token, secret, status) {
    return new Promise((resolve, reject) => {
      this.mainClass.OAuthClient.post(
        'https://api.twitter.com/1.1/statuses/update.json',
        token,
        secret,
        { status },
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

  getTimeline (token, secret, sinceID = 1, count = 1) {
    return new Promise((resolve, reject) => {
      this.mainClass.OAuthClient.get(
        `https://api.twitter.com/1.1/statuses/home_timeline.json?count=${count}&since_id=${sinceID}`,
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
}

async function init () {
  this.RestClient = new RestClient(this, this.config);
}

module.exports = init;