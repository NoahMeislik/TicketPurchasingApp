const request = require('request'),
path = require('path'),
fs = require('fs'),
config = require(path.resolve('./config/config.js')),
moment = require('moment'),
_ = require('lodash');

const eventEndpoint = "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&apikey="+config.apiKey+"&endDateTime="+moment(Date.now()).format("YYYY-MM-DDTHH:mm:ssZ");




//Parameters for event date search YYYY-MM-DDTHH:mm:ssZ
let getPreviousEventData = function(){
        request(eventEndpoint, (error, response, body) => {
            if (error || response.statusCode !== 200) return console.log(`Error: ${error} - Status Code: ${response.statusCode}`);
            fs.writeFile(config.ticketMasterPaths.previousEventData,JSON.stringify(body), (err) => {
                if(err) throw err
                console.log("Written event data to file.");
            });
        });     
}

let parseEventData = function() {
    let eventData = require(config.ticketMasterPaths.previousEventData);
    eventList = eventData['_embedded']
    console.log(eventList);

}


// Grabs fresh event data
getPreviousEventData();
parseEventData();
setInterval(() => {
    getPreviousEventData();
    parseEventData();
},config.eventSearchTimer);

