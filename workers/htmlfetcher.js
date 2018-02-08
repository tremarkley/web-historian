var archive = require('../helpers/archive-helpers');
var logger = require('../logs/logger');

// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
exports.htmlfetcher = function() {
    archive.readListOfUrls(function(urls) {
        console.log('urls: ' + JSON.stringify(urls));
        logger.log('fetched urls: ' + JSON.stringify(urls));
        archive.downloadUrls(urls);
    })
}

//run html fetcher 
exports.htmlfetcher();
