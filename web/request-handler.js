var path = require('path');
var archive = require('../helpers/archive-helpers');
var url = require('url');
var httphelpers = require('./http-helpers');
var fs = require('fs');
var querystring = require('querystring');
// require more modules/folders here!

var retrieveAsset = function(path, req, res, statusCode) {
  try {
    httphelpers.serveAssets(res, path, statusCode, function(res, data, statusCode) {
      //res.end(data);
      httphelpers.sendResponse(res, data, statusCode);
    });
  } catch (e) {
    statusCode = 403;
    res.writeHead(statusCode, httphelpers.headers);
    res.end(JSON.stringify(e));
  }
};

var retrieveLoadingPage = function(req, res) {
  var loadingPagePath = archive.paths.siteAssets + '/loading.html';
  retrieveAsset(loadingPagePath, req, res, 302);
};

var retrieveHomePage = function(req, res) {
  var homePagePath = __dirname + '/public/index.html';
  retrieveAsset(homePagePath, req, res, 200);
};

var handlePost = function(req, res) {
  httphelpers.readRequest(req, res, function(data) {
    var url = querystring.parse(data).url;
    console.log('URL IS ' + url);
    archive.isUrlInList(url, function(result) {
      //result returns whether the url was found in the list
      if (!result) {
        archive.addUrlToList(url, function() {
          statusCode = 302;
          console.log('statusCode ' + statusCode);
          //httphelpers.headers['Content-Type'] = 'application/json';
          res.writeHead(statusCode, httphelpers.headers);
          //res.end(JSON.stringify({results: 'Successful POST'}));
          retrieveLoadingPage(req, res);
        });
      } else {
        statusCode = 302;
        httphelpers.headers['Content-Type'] = 'application/json';
        res.writeHead(statusCode, httphelpers.headers);
        res.end(JSON.stringify({results: 'Successful POST'}));
      }
    });
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
  retrieveAsset(stylesPath, req, res, 200);
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


