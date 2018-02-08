var fs = require('fs');
var path = require('path');

exports.paths = {
  siteAssets: path.join(__dirname, './logs.txt'),
};

exports.log = function(msg) {
    fs.appendFile(exports.paths.siteAssets, new Date().toLocaleString() + '\t' + msg + '\n', (err) => {
        try {
            if (err) { throw err; }
            console.log('successfully appended msg to ' + exports.paths.siteAssets);
        } catch (err) {
            console.log('log failed: ' + e.toString());
        }
    });
}