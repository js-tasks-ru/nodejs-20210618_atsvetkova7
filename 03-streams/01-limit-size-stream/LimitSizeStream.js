const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.encoding = options.encoding;
    this.sumByte = 0;
  }

  _transform(chunk, encoding, callback) {
    const byteLength = Buffer.byteLength(chunk, this.encoding);
    this.sumByte = this.sumByte + byteLength;

    if (this.sumByte > this.limit) {
      callback(new LimitExceededError());
    }

    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
