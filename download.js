const fs = require('fs');
const download = require('download');
var gzipy = require('gzipy');

download('http://app.ticketmaster.com/dc/feeds/v1/events.json?apikey=8ggd773EzUJqQ6TK4ypOoHp6FePW0nmq', 'data').then(() => {
	gzipy.decompress('./data/feed.json.gz', './data/feed.json', function(error)
	{
	  if(error) return console.log(error);
	  console.log('File decompressed');
	});
    console.log('downloaded!');
});