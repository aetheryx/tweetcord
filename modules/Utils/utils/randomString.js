const { randomBytes } = require('crypto');

function randomString (length) {
  return randomBytes(length / 2).toString('hex');
}

module.exports = randomString;