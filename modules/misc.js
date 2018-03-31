const donatorURL = 'api.github.com/gists/ecb8d961b77871a56e7d3a7145cfc179';

module.exports = {
  order: 7,
  func: async function createMisc () {
    const credentialRX = new RegExp(
      [
        this.config.bot.token,
        this.config.bot.secret,
        this.config.twitter.secret,
        this.config.twitter.APIKey,
        this.config.web.secret
      ].join('|'),
      'gi'
    );

    this.misc = {
      redact: (str) => str.replace(credentialRX, 'i think the fuck not you trick ass bitch'),

      donators: await this.utils.get({
        url: donatorURL
      }).then(res => JSON.parse(res.files['donators.json'].content))
    };

    if (this.config.dev) {
      const { watch } = require('chokidar');
      const { exec } = require('child_process');

      const watcher = watch(`${__dirname}/Web/views/`, {
        persistent: true,
        ignored: /build/
      });

      console.log('watching');

      watcher.on('change', path => {
        console.log('Building...');
        exec('webpack --mode development', (e, stdout, stderr) => {
          console.log(stdout);
        });
      });
    }

  }
};
