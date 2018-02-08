var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var readline = require('readline');
var http = require('http');
var httphelpers = require('../web/http-helpers');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!
exports.readListOfUrls = function(callback) {
  var arraySites = [];
  var rl = readline.createInterface({
    input: fs.createReadStream(exports.paths.list)
  });
  rl.on('line', function(line) {
    arraySites.push(line);
  });
  rl.on('close', function() {
    callback(arraySites);
  });
};

exports.isUrlInList = function(url, callback) {
  var isUrlInList = false;
  exports.readListOfUrls(function(array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] === url) {
        isUrlInList = true;
        break;
      }
    }
    callback(isUrlInList);
  });
};

exports.addUrlToList = function(url, callback) {
  //use fs appendfile to append to the exports.paths.list
  fs.appendFile(exports.paths.list, url + '\n', (err) => {
    if (err) { throw err; }
    console.log('successfully appended url to ' + exports.paths.list);
    if (callback) {
      callback();
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.stat(exports.paths.archivedSites + '/' + url, (err, stats) => {
    if (stats !== undefined) {
      callback(true);
    } else {
      callback(false);
    }
  });
};

exports.writeToArchivedSites = function(url, data) {
  var path = exports.paths.archivedSites + '/' + url;
  fs.writeFile(path, data, (err) => {
    if (err) {
      console.log('unable to save file: ' + err.toString());
    }
    console.log('successfully saved file');
  })
}

exports.downloadUrls = function(urls) {
  for (var i = 0; i < urls.length; i++) {
    var test = urls[i];
    http.get('http://' + urls[i], function(res) {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          //write to file
          exports.writeToArchivedSites(test, data);
        } catch (e) {
          console.log('download failed ' + e.toString());
        }
      });
    })
  }
};
