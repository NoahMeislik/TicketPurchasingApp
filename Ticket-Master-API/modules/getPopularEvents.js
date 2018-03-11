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
const PurchasedEvent = require(config.personalApiPaths.models.purchasedEvents)


// This combines both artists and the upcoming events together to find regex matches to find "popular" events
let getPopularEvents = function() {
    let popularEvents = [];
    artists.find({}, (err, artists) => {
        if (err) {
            return res.status(500).send("Unable to query artists at this time");
        }
        for (let i = 0; i < artists.length; i += 1) {
            upcomingEvents.findOne({
                "queryParameter": {
                    $regex: artists[i].name,
                    $options: 'ib'
                }
            }, (err, popularEvent) => {
                if (err) {
                    return console.log(err);
                }
                if (popularEvent) {
                  if (popularEvent.category1 == "Music") {
                      queuedEvents.findOne({ "eventId" : popularEvent.eventId}, (err, event) => {
                        if (!event){
                            PurchasedEvent.findOne({ "eventId" : popularEvent.eventId}, function(err, purchasedEvent){
                                if(!purchasedEvent){
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
                                            if (err)return console.log(err);
                                            else console.log("Saved new popular event to DB");
                                        });
                                    });
                                }
                            })
                    }
                    });
                  }
                }
              }
            );
          }
    });
};


let cleanDeprecatedEvents = function() 
{
    // clean from popular events
    PopularEvent.find({}, (err, events) => {
        for (let i = 0; i < events.length; i++) {
            let onsaleStartDateTime = events[i].onsaleStartDateTime;
            onsaleStartDateTime = moment(onsaleStartDateTime, "YYYY-MM-DDTHH:mm:ssZ");
            let difference = onsaleStartDateTime.diff(Date.now(), 'days');
            if (difference < 0)
            {
                PopularEvent.findOneAndRemove({eventId: events[i].eventId}, function(err){
                    console.log(`Removed event with ID ${events[i].eventId}`);
                    if (err) return console.log(err);
                });
            }
        }
    });

    // clean from queued events
    queuedEvents.find({}, (err, events) => {
        for (let i = 0; i < events.length; i++) {
            let onsaleStartDateTime = events[i].onsaleStartDateTime;
            onsaleStartDateTime = moment(onsaleStartDateTime, "YYYY-MM-DDTHH:mm:ssZ");
            let difference = onsaleStartDateTime.diff(Date.now(), 'days');
            if (difference < 0)
            {
                queuedEvents.findOneAndRemove({eventId: events[i].eventId}, function(err){
                    console.log(`Removed event with ID ${events[i].eventId}`);
                    if (err) return console.log(err);
                });
            }
        }
    });

}


module.exports = {
    getPopularEvents: getPopularEvents,
    cleanDeprecatedEvents: cleanDeprecatedEvents

}