const donatorURL = 'api.github.com/gists/ecb8d961b77871a56e7d3a7145cfc179';

module.exports = {
  order: 7,
  func: async function createMisc () {
    this.misc = {
      credentialRX: new RegExp(
        [
          this.config.bot.token,
          this.config.bot.secret,
          this.config.twitter.secret,
          this.config.twitter.APIKey,
          this.config.web.secret
        ].join('|'),
        'gi'
      ),
      donators: await this.utils.get({
        url: donatorURL
      }).then(res => JSON.parse(res.files['donators.json'].content))
    };
  }
};
