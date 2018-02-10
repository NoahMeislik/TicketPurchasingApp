const request = require('request'),
path = require('path'),
fs = require('fs'),
config = require(path.resolve('./config/config.js')),
moment = require('moment'),
_ = require('lodash');




let time = moment(Date.now()).format('YYYY-MM-DD[T]HH:mm:ss');

//Parameters for event date search YYYY-MM-DDTHH:mm:ssZ
let getEventData = function(){

        let eventEndpoint = "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&apikey="+config.apiKey+"&startDateTime="+time+"Z&size=200";

        request(eventEndpoint, (error, response, body) => {
            if (error || response.statusCode !== 200) return console.log(`Error: ${error} - Status Code: ${response.statusCode}`);
            fs.writeFile(config.ticketMasterPaths.previousEventData,JSON.stringify(body), (err) => {
                if(err) throw err
                console.log("Written first page of event data to file.");
                getAllEventData();
            });
        });
        
}

let getAllEventData = function() {
    let firstPage = JSON.parse(require(config.ticketMasterPaths.previousEventData));
    numPages = firstPage['page']['totalPages'];

    for (let index = 1; index < numPages; index++) {
        let eventEndpoint = "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&apikey="+config.apiKey+"&startDateTime="+time+"Z&size=200"+"&page="+index;
        request(eventEndpoint, (error, response, body) => {
                console.log(eventEndpoint);
                if (error || response.statusCode !== 200) return console.log(`Error: ${error} - Status Code: ${response.statusCode}`);
                fs.appendFile(config.ticketMasterPaths.previousEventData,JSON.stringify(body), (err) => {
                    if(err) throw err
                    console.log(`Page ${index} written to file`);
                });
            });
    }
}

let parseEventData = function() {
    let eventData = require(config.ticketMasterPaths.previousEventData);
    eventList = eventData['_embedded']
    console.log(eventList);

}


// Grabs fresh event data
// getPreviousEventData();
// parseEventData();
// setInterval(() => {
//     getPreviousEventData();
//     parseEventData();
// },config.eventSearchTimer);

getEventData();
