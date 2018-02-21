module.exports = {
  order: 0,
  func: async function utils () {
    this.utils = require(`${__dirname}/utils`);
    this.log = this.utils.log;
  }
};