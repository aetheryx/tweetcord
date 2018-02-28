const { randomBytes } = require('crypto');

module.exports = function randomString (length) {
  return randomBytes(length / 2).toString('hex');
};
