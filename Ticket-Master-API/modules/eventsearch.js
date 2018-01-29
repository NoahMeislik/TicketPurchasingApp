const request = require('request'),
fs = require('fs'),
config = require('../../config/config.js'),
moment = require('moment'),
_ = require('lodash');

const eventEndpoint = "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&apikey="+config.apiKey+"&endDateTime="+moment(Date.now()).format("YYYY-MM-DDTHH:mm:ssZ");




//Parameters for event date search YYYY-MM-DDTHH:mm:ssZ
let getPreviousEventData = function(){
        request(eventEndpoint, (error, response, body) => {
            if (error || response.statusCode !== 200) return console.log(`Error: ${error} - Status Code: ${response.statusCode}`);
            fs.writeFile(config.paths.previousEventData,JSON.stringify(body), (err) => {
                if(err) throw err
                console.log("Written event data to file.");
            });
        });     
}

let parseEventData = function() {
    let eventData = require(config.paths.previousEventData);
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

