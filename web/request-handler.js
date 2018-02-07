var path = require('path');
var archive = require('../helpers/archive-helpers');
var url = require('url');
var httphelpers = require('./http-helpers');
var fs = require('fs');
// require more modules/folders here!

var homepage = function(req, res) {
  var homePageHTML = '';
  fs.readFile(__dirname + '/public/index.html', 'utf8', (err, data) => {
    homePageHTML = data;
    res.end(data);
  });
};

var router = {
  '/': homepage
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


