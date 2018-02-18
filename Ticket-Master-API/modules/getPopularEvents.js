const zlib = require('zlib')
const oboe = require('oboe')
const got = require('got')
const path = require('path')
const moment = require('moment')
const config = require(path.resolve('./config/config.js'))
const request = require('request');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoDB);

 //Models
const Ticket = require(config.personalApiPaths.models.upcomingEvents);
const PopularEvent = require(config.personalApiPaths.models.popularEvents)
const artists = require(config.personalApiPaths.models.artists);
const upcomingEvents = require(config.personalApiPaths.models.upcomingEvents);
const queuedEvents = require(config.personalApiPaths.models.queuedEvents);


// This combines both artists and the upcoming events together to find regex matches to find "popular" events
let getPopularEvents = function() {
    let popularEvents = [];
    artists.find({}, (err, artists) => {
        if (err) {
            return res.status(500).send("Unable to query artists at this time");
        }
        for (let i = 0; i < artists.length; i += 1) {
            console.log(`Checking for popular event for: ${artists[i].name}`);
            upcomingEvents.findOne({
                "queryParameter": {
                    $regex: artists[i].name,
                    $options: 'i(\w+)'
                }
            }, (err, popularEvent) => {
                if (err) {
                    return console.log(err);
                }



                if (popularEvent !== null) {
                  if (popularEvent.category1 == "Music") {
                      queuedEvents.find({ "eventId" : popularEvent.eventId}, (err, event) => {
                        if (event !== null){
                         
                        let eventDataURL = `https://app.ticketmaster.com/discovery/v2/events/${popularEvent.eventId}.json?apikey=${config.apiKey}`; 
                        request(eventDataURL, (error,response,body)=>{
                            
                            if (error) return console.log(error);
                            let parsed = JSON.parse(body);
                            let seatmapData = "N/A";
                            if (parsed.seatmap) seatmapData = parsed.seatmap.staticUrl;
                            
                            let eventInfo = {
                                eventArtist: artists[i].name,
                                eventId: popularEvent.eventId,
                                primaryEventUrl: popularEvent.primaryEventUrl,
                                resaleEventUrl: popularEvent.resaleEventUrl,
                                eventName: popularEvent.eventName,
                                eventNotes: popularEvent.eventNotes,
                                eventStatus: popularEvent.eventStatus,
                                eventImageUrl: popularEvent.eventImageUrl,
                                eventStartDateTime: popularEvent.eventStartDateTime,
                                eventEndDateTime: popularEvent.eventEndDateTime,
                                eventStartLocalDate: popularEvent.eventStartLocalDate,
                                venue: popularEvent.venue,
                                minPrice: popularEvent.minPrice,
                                maxPrice: popularEvent.maxPrice,
                                category1: popularEvent.classificationSegment,
                                category2: popularEvent.classificationGenre,
                                category3: popularEvent.classificationSubGenre,
                                queryParameter: popularEvent.eventNotes + " - " + popularEvent.eventName,
                                sales: parsed.sales,
                                seatMap: seatmapData,
                                onsaleStartDateTime: popularEvent.onsaleStartDateTime,
                                onsaleEndDateTime: popularEvent.onsaleEndDateTime,
                            };
                            popularEvent = new PopularEvent(eventInfo)

                            popularEvent.save(function(err) {
                                if (err) {
                                    if (err.name == "BulkWriteError") {
                                        return console.log("Duplicated data, skipping!");
                                    } 
                                    else {
                                        return console.log(err);
                                    }
                                }
                                else console.log("Saved new popular event to DB");
                            });
                        });
                          

                        }
                    else{
                    console.log("Event already queued")
                    }
                      });
                  }
                }
                else 
                {
                    console.log(`Found no events for artist ${artists[i].name}`);
                }
              }
            );
          }
    });
};

module.exports = {
    getPopularEvents: getPopularEvents
}