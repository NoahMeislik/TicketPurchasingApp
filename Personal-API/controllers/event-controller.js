const path = require('path');
const config = require(path.resolve('./config/config.js'))
const upcomingEvents = require(config.personalApiPaths.models.upcomingEvents);
const artists = require(config.personalApiPaths.models.artists);
const QueuedEvent = require(config.personalApiPaths.models.queuedEvents);


module.exports.getUpcomingEvents = function(req, res){
    upcomingEvents.find({},(err,events) => {
        if(err) return res.status(500).send("Unable to query upcoming events at this time");
        res.json({
            upcomingEvents: events
        });
    });
}

// This combines both artists and the upcoming events together to find regex matches to find "popular" events
module.exports.getPopularEvents = function(req, res){
    let popularEvents = [];
    artists.find({},(err,artists) => {
        if(err) return res.status(500).send("Unable to query artists at this time");
        for (let i = 0; i < artists.length; i++) {
            console.log(`Checking for popular event for: ${artists[i].name}`);
            upcomingEvents.findOne({ "queryParameter" : { $regex: artists[i].name, $options: 'i(\w+)' }}, (err, event) => {
                if (err) return console.log(err);
                // terrible practice
                if(artists.length - 1 === i) {
                    console.log('loop ends');
                    res.json({
                        "popularEvents": popularEvents
                    });
                }
                else {
                    if (event !== null) 
                    {
                        if (event.category1 == "Music")
                        {
                            QueuedEvent.findOne({ "eventId" : event.eventID}, (err, queueevent) => {
                                if(err) return res.status(500).send("Unable to query upcoming events at this time");
                                if (queueevent == null)
                                {
                                    let eventInfo = {
                                        "eventArtist": artists[i].name,
                                        "eventInfo": event
                                    };
                                    popularEvents.push(eventInfo);
                                    console.log(`Found popular event for ${artists[i].name}`);
                                    console.log(popularEvents);
                                }
                                else {
                                    console.log("Event already been queued");
                                }

                            });

                        }

                    }
                    else 
                    {
                        console.log(`Could not find popular event for: ${artists[i].name}`);
                    }
                }
            });
        }
    });
}


module.exports.queueEvent = function(req, res){
    upcomingEvents.findOne({ "eventId" : req.body.eventID}, (err, event) => {
        if(err) return res.status(500).send("Unable to query upcoming events at this time");
        let eventToQueue = {
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
            presale: event.presales,
            onsaleStartDateTime: event.onsaleStartDateTime,
            onsaleEndDateTime: event.onsaleEndDateTime,
        };
        let queuedEvent = new QueuedEvent(eventToQueue);
        queuedEvent.save(function(err){
            if(err){
                // TODO: Change this, I really cringe at the bad practice but oh well
                if(err.name == "BulkWriteError") return console.log("Duplicated data, skipping!");
                else return console.log(err);
            }
            console.log(`Adding new event to the queue with ID: ${event.eventId}`);
        });
    });
}