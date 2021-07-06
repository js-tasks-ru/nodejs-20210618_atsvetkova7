const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.fullLine = '';
  }

  _transform(chunk, encoding, callback) {
    this.fullLine += chunk.toString('utf-8');
    const chunks = this.fullLine.split(os.EOL);
    this.fullLine = chunks.pop();
    chunks.forEach((item) => {
      this.push(item);
    });
    callback();
  }

  _flush(callback) {
    if (this.fullLine) {
      this.push(this.fullLine);
    }
    callback();
  }
}

module.exports = LineSplitStream;
