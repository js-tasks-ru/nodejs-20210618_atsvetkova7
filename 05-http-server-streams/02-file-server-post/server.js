const url = require('url');
const http = require('http');
const path = require('path');
const LimitSizeStream = require('./LimitSizeStream');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      const limitedStream = new LimitSizeStream({limit: 1048576, encoding: 'utf-8'});

      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Nested file is not supported');
        return;
      }

      const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});

      req
          .pipe(limitedStream)
          .on('error', (err) => {
            res.statusCode = 413;
            res.end('Really huge file :(');
            writeStream.destroy();
            if (err.code === 'LIMIT_EXCEEDED') {
              fs.unlink(filepath, (err) => {
                if (err) {
                  res.statusCode = 500;
                  res.end('Something went wrong');
                  return;
                }
              });
            }
          })
          .pipe(writeStream)
          .on('error', (err) => {
            if (err.code === 'EEXIST') {
              res.statusCode = 409;
              res.end('Duplicate file');
              return;
            } else {
              res.statusCode = 500;
              res.end('Something went wrong');
            }
          })
          .on('finish', () => {
            res.statusCode = 201;
            res.end('ok');
          });

      req.on('aborted', () => {
        writeStream.destroy();
        fs.unlink(filepath, (err) => {
          if (err) {
            console.log('Unable to delete');
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
