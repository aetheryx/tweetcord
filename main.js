const modules = require('./modules');
const util = require('./util');

class Tweetcord {
  constructor () {
    this.config = require('./config.json');
    this.util = require('./util');
    this.log = util.log;

    for (const module in modules) {
      modules[module].call(this);
    }

    if (!this.config.web.domain) {
      this.config.web.domain = 'http://localhost:42069';
    }
  }
}

new Tweetcord();