const { randomBytes } = require('crypto');

function randomString (length) {
  return randomBytes(length / 2).toString('hex'); // note: this will return 1 less char on odd inputs
}

module.exports = randomString;