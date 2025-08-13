const crypto = require('crypto');

function hashValue(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

module.exports = { hashValue };
