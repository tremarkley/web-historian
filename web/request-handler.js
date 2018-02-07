var path = require('path');
var archive = require('../helpers/archive-helpers');
var url = require('url');
var httphelpers = require('./http-helpers');
var fs = require('fs');
// require more modules/folders here!

var retrieveAsset = function(req, res) {
  
}

var retrieveHomepage = function(req, res) {
  var homePagePath = __dirname + '/public/index.html';
  try {
    httphelpers.serveAssets(res, homePagePath, function(res, data) {
      res.end(data);
    })
  } catch (e) {
    statusCode = 403;
    res.writeHead(statusCode, httphelpers.headers);
    res.end(JSON.stringify(e));
  }
};

var retrieveStyles = function(req, res) {

}


var router = {
  '/': retrieveHomepage,
  '/styles.css' : retrieveStyles 
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


