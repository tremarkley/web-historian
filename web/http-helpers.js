var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, statusCode, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  fs.readFile(asset, 'utf8', (err, data) => {
    if (err) { throw err; }
    callback(res, data, statusCode);
  });
};

exports.sendResponse = function(res, data, statusCode) {
  res.writeHead(statusCode, exports.headers);
  res.end(data);
};

exports.readRequest = function(req, res, callback) {
  let data = '';
  req.on('data', (chunk) => {
    data += chunk;
  });
  req.on('end', () => {
    try {
      console.log('data from request: ' + data);
      callback(data);
    } catch (e) {
      //error handling
      statusCode = 403;
      var headers = httphelpers.headers;
      res.writeHead(statusCode, headers);
      res.end('POST Failed: ' + e.toString());
    }
  });
};



// As you progress, keep thinking about what helper functions you can put here!
