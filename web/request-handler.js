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
    statusCode = 404;
    res.writeHead(statusCode, httphelpers.headers);
    res.end('Unable to retrieve asset ' + JSON.stringify(e));
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
    //after reading request parse url to find the url that the user is looking for
    var url = querystring.parse(data).url;
    console.log('URL IS ' + url);
    //check if url is archived
    archive.isUrlArchived(url, function(result) {
      console.log('is url: ' + url + ' archived: ' + result);
      if (result) {
        var path = archive.paths.archivedSites + '/' + url;
        retrieveAsset(path, req, res, 200);
      } else {
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
      }
    });
  });
};

var getSiteFromArchive = function(req, res) {
  var asset = url.parse(req.url).pathname.slice(1);
  var path = archive.paths.archivedSites + '/' + asset;
  retrieveAsset(path, req, res, 200);
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
  //check to see if there is a url after the url if not go to router
  var route = router[url.parse(req.url).pathname];
  if (route) {
    route(req, res);
  } else {
    if (req.method === 'GET') {
      getSiteFromArchive(req, res);
    } else {
      httphelpers.sendResponse(res, '', 404);
    }
  }
  //always sending back the list at /archives/sites.txt', why was this in here initially?
  //res.end(archive.paths.list);
};


