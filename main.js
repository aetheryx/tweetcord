const modules = require('./modules');
const util = require('./util');

class Tweetcord {
  constructor () {
    this.config = require('./config.json');
    this.util = require('./util');
    this.log = util.log;

    if (!this.config.web.domain) {
      this.config.web.domain = 'http://localhost:42069';
    }

    this.importModules();
  }

  async importModules () {
    for (const module in modules) {
      await modules[module].call(this);
    }
  }
}

new Tweetcord();