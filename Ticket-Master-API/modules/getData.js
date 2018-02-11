const request = require('request'),
path = require('path'),
fs = require('fs'),
config = require(path.resolve('./config/config.js')),
moment = require('moment'),
_ = require('lodash'),
download = require('download'),
gzipy = require('gzipy');

let time = moment(Date.now()).format('YYYY-MM-DD[T]HH:mm:ss');

downloadData = function(){
	download(`http://app.ticketmaster.com/dc/feeds/v1/events.json?apikey=${config.apiKey}`, 'data').then(() => {
		console.log("Downloaded zipped file")
		gzipy.decompress(config.ticketMasterPaths.eventData, config.ticketMasterPaths.eventData, (error) => {
			if(error) return console.log(error);
			console.log('File decompressed');
		});
	}).catch((error) => {
		if (error.statusCode == "504") return downloadData(),console.log("Gateway timeout, restarting download function!");
	});
}

