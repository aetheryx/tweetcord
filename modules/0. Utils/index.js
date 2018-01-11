const utils = require(`${__dirname}/utils`);

async function init () {
  this.utils = utils;
  this.log = utils.log;
}

module.exports = init;