const url = require('url');
const http = require('http');
const path = require('path');
const LimitSizeStream = require('./LimitSizeStream');
const fs = require('fs');

const server = new http.Server();

const limitedStream = new LimitSizeStream({limit: 1048576, encoding: 'utf-8'});
server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':

      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Nested file is not supported');
        return;
      }

      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end('Duplicate file');
        return;
      }

      const writeStream = fs.createWriteStream(filepath);

      req
          .pipe(limitedStream)
          .on('error', () => {
            writeStream.destroy();
            fs.unlink(filepath, (err) => {
              if (err) {
                res.statusCode = 500;
                res.end('Something went wrong');
                return;
              }
              res.statusCode = 413;
              res.end('Really huge file :(');
            });
          })
          .pipe(writeStream)
          .on('error', () => {
            res.statusCode = 500;
            res.end('Something went wrong');
          });

      req.on('end', () => {
        res.statusCode = 201;
        res.end('ok');
      });

      req.on('aborted', () => {
        writeStream.destroy();
        fs.unlink(filepath, (err) => {
          if (err) {
            res.statusCode = 500;
            res.end('Something went wrong');
            return;
          }
        });
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
