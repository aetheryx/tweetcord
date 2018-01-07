const { Client } = require('discord.js');
const events = require(`${__dirname}/events`);

function init () {
  const _this = this;

  class Bot extends Client {
    constructor () {
      super();
      this.login(_this.config.discord.token);

      // this.loadCommands();

      this
        .on('ready', events.onReady.bind(_this));
    }

    async loadCommands () {

    }
  }

  this.bot = new Bot();
}

module.exports = init;