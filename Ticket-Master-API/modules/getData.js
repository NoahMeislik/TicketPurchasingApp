const request = require('request'),
path = require('path'),
fs = require('fs'),
config = require(path.resolve('./config/config.js')),
moment = require('moment'),
_ = require('lodash');
const download = require('download');
var gzipy = require('gzipy');



let time = moment(Date.now()).format('YYYY-MM-DD[T]HH:mm:ss');

downloadData = function(){
	download(`http://app.ticketmaster.com/dc/feeds/v1/events.json?apikey=${config.apiKey}`, 'data').then(() => {
		console.log("Downloaded zipped file")
		gzipy.decompress(`${config.ticketMasterPaths.eventData}/feed.json.gz`, `${config.ticketMasterPaths.eventData}/feed.json`, function(error)
		{
		if(error) return console.log(error);
		console.log('File decompressed');
		});
		console.log('Downloaded!');
	});
}


downloadData()