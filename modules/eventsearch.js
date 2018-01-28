const request = require('request'),
fs = require('fs'),
config = require('../config/config.js'),
moment = require('moment'),
_ = require('lodash');

const eventEndpoint = "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&apikey="+config.apiKey+"&onsaleStartDateTime="+moment(Date.now()).format("YYYY-MM-DDTHH:mm:ssZ");





let getEventData = function(){
        request(eventEndpoint, (error, response, body) => {
            if (error || response.statusCode !== 200) return console.log(`Error: ${error} - Status Code: ${response.statusCode}`);
            fs.writeFile('./data/eventdata/eventlist.json',JSON.stringify(body));
            console.log("Written event data to file.");
        });    
}

let parseEventData = function() {
    let eventList = require("../data/eventdata/eventlist.json");
    eventList = JSON.parse(eventList);
    // console.log(eventList['_embedded']);

}


// Grabs fresh event data
getEventData();
parseEventData();
setInterval(() => {
    getEventData();
    parseEventData();
},config.eventSearchTimer);

