const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':

      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Nested file is not supported');
      }

      const stream = fs.createReadStream(filepath);
      stream.pipe(res);

      stream.on('error', (err) => {
        if (err.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('File does not exist');
        } else {
          res.statusCode = 500;
          res.end('Something went wrong');
        }
      });

      req.on('aborted', () => {
        stream.destroy();
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
