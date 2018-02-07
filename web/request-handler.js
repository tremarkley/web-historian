var path = require('path');
var archive = require('../helpers/archive-helpers');
var url = require('url');
var httphelpers = require('./http-helpers');
var fs = require('fs');
// require more modules/folders here!

var retrieveAsset = function(path, req, res) {
  try {
    httphelpers.serveAssets(res, path, function(res, data, statusCode) {
      //res.end(data);
      httphelpers.sendResponse(res, data, statusCode);
    });
  } catch (e) {
    statusCode = 403;
    res.writeHead(statusCode, httphelpers.headers);
    res.end(JSON.stringify(e));
  }
};

var retrieveHomePage = function(req, res) {
  var homePagePath = __dirname + '/public/index.html';
  retrieveAsset(homePagePath, req, res);
};

var handlePost = function(req, res) {
  let data = '';
  req.on('data', (chunk) => {
    data += chunk;
  });
  req.on('end', () => {
    try {
      statusCode = 201;
      var headers = httphelpers.headers;
      res.writeHead(statusCode, headers);
      res.end(JSON.stringify({results: 'Successful POST'}));
    } catch (e) {
      //error handling
    }
  });
};

var Homepage = function(req, res) {
  if (req.method === 'GET') {
    retrieveHomePage(req, res);
  } else if (req.method === 'POST') {
    handlePost(req, res);
  }
};



var retrieveStyles = function(req, res) {
  var stylesPath = __dirname + '/public/styles.css';
  retrieveAsset(stylesPath, req, res);
};

var router = {
  '/': Homepage,
  '/styles.css': retrieveStyles 
};

exports.handleRequest = function (req, res) {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  var route = router[url.parse(req.url).pathname];
  if (route) {
    route(req, res);
  } else {
    httphelpers.sendResponse(res, '', 404);
  }
  //always sending back the list at /archives/sites.txt', why was this in here initially?
  //res.end(archive.paths.list);
};


