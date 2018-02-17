const zlib = require('zlib')
const oboe = require('oboe')
const got = require('got')
const path = require('path')
const moment = require('moment')
const config = require(path.resolve('./config/config.js'))
const url = `http://app.ticketmaster.com/dc/feeds/v1/events.json?apikey=${config.apiKey}`
const gunzip = zlib.createGunzip()


// init mongo connection
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoDB);

const Ticket = require(config.personalApiPaths.models.upcomingEvents);
const PopularEvent = require(config.personalApiPaths.models.popularEvents)
const artists = require(config.personalApiPaths.models.artists);
const upcomingEvents = require(config.personalApiPaths.models.upcomingEvents);




let downloadData = function() {
    got.stream(url).pipe(gunzip);
    oboe(gunzip).node('events.*', event => {
        // Check if the actual event has a onsaleStarDate
        let onsaleStartDateTime = event.onsaleStartDateTime;
        if (onsaleStartDateTime !== null || event.eventStatus == "presale") {
            // Subtract one day from the onsalestartdatetime to see if it goes on sale within a day
            onsaleStartDateTime = moment(onsaleStartDateTime, "YYYY-MM-DDTHH:mm:ssZ");
            let difference = onsaleStartDateTime.diff(Date.now(), 'days')
            if (difference > config.ticketMasterApi.dateDifference || event.eventStatus == "presale") {
                if (event.eventStartDateTime || event.eventStatus == "presale") {
                    let ticketObject = {
                        eventId: event.eventId,
                        primaryEventUrl: event.primaryEventUrl,
                        resaleEventUrl: event.resaleEventUrl,
                        eventName: event.eventName,
                        eventNotes: event.eventNotes,
                        eventStatus: event.eventStatus,
                        eventImageUrl: event.eventImageUrl,
                        eventStartDateTime: event.eventStartDateTime,
                        eventEndDateTime: event.eventEndDateTime,
                        eventStartLocalDate: event.eventStartLocalDate,
                        venue: event.venue,
                        minPrice: event.minPrice,
                        maxPrice: event.maxPrice,
                        category1: event.classificationSegment,
                        category2: event.classificationGenre,
                        category3: event.classificationSubGenre,
                        queryParameter: event.eventNotes + " - " + event.eventName,
                        presale: event.presales,
                        onsaleStartDateTime: event.onsaleStartDateTime,
                        onsaleEndDateTime: event.onsaleEndDateTime,
                    };

                    let ticket = new Ticket(ticketObject);
                    ticket.save(function(err) {
                        if (err) {
                            // TODO: Change this, I really cringe at the bad practice but oh well
                            if (err.name == "BulkWriteError") return console.log("Duplicated data, skipping!");
                            else return console.log(err.name);
                        }
                        console.log(`Adding new event to the datbase with ID: ${event.eventId}`);

                    });
                }
            }
        }
    });
}

let getPopularEvents = function() {
        let popularEvents = [];
        artists.find({}, (err, artists) => {
                if (err) return res.status(500).send("Unable to query artists at this time");
                for (let i = 0; i < artists.length; i++) {
                    console.log(`Checking for popular event for: ${artists[i].name}`);
                    upcomingEvents.findOne({
                        "queryParameter": {
                            $regex: artists[i].name,
                            $options: 'i(\w+)'
                        }
                    }, (err, event) => {
                        if (err) return console.log(err);
                        // terrible practice
                        if (artists.length - 1 === i) {
                            console.log('Searched for all popular events!');
                        }

                        if (event !== null) {
                            if (event.category1 == "Music") {

                                {
                                    let eventInfo = {
                                        "eventArtist": artists[i].name,
                                        "eventInfo": event
                                    };
                                    popularEvent = new popularEvents(eventInfo)

                                    popularEvent.save(function(err) {
                                        if (err) {
                                            console.log("There was an error saving popular event!");
                                        }
                                    })
                                }

                            } 
                            else {
                                console.log(`Could not find popular event for: ${artists[i].name}`);
                            }
                        }
                    });
                  };
                });
            };

let init = function(){
  downloadData();
  getPopularEvents();
}
getPopularEvents();
