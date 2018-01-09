const botPackage = require(`${__dirname}/package.json`);

const modules = require(`${__dirname}/modules`);
const util = require(`${__dirname}/util`);

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

  get package () {
    return botPackage;
  }
}

new Tweetcord();