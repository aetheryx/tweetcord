const { createHmac } = require('crypto');

function hashHmac (src, key) {
  return createHmac('sha1', key)
    .update(src)
    .digest('base64');
}

module.exports = { hashHmac };