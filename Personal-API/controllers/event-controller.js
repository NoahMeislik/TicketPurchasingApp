const path = require('path');
const config = require(path.resolve('./config/config.js'))

//Models
const upcomingEvents = require(config.personalApiPaths.models.upcomingEvents);
const artists = require(config.personalApiPaths.models.artists);
const QueuedEvent = require(config.personalApiPaths.models.queuedEvents);
const PopularEvents = require(config.personalApiPaths.models.popularEvents)


module.exports.getUpcomingEvents = function(req, res){
    upcomingEvents.find({},(err,events) => {
        if(err) return res.status(500).send("Unable to query upcoming events at this time");
        res.json({
            upcomingEvents: events
        });
    });
}

module.exports.getPopularEvents = function(req, res){
    PopularEvents.find({}, (err, events) => {
        res.json({
            totalEvents: events.length,
            popularEvents: events
        })
    })
};

module.exports.getQueuedEvents = function(req, res){
    QueuedEvent.find({}, (err, events) => {
        res.json({
            totalQueuedEvents: events.length,
            queuedEvents: events
        })
    })
}

module.exports.queueEvent = function(req, res){
    PopularEvents.findOne({ "eventId" : req.body.eventID}, (err, event) => {
        if(err) return res.status(500).send("Unable to query upcoming events at this time");
        console.log(event);
        let eventToQueue = {
            eventArtist: event.eventArtist,
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
            sales: event.sales,
            seatMap: event.seatMap,
            onsaleStartDateTime: event.onsaleStartDateTime,
            onsaleEndDateTime: event.onsaleEndDateTime,
        };
        console.log(eventToQueue);

        let queuedEvent = new QueuedEvent(eventToQueue);
        queuedEvent.save(function(err){
            if(err){
                // TODO: Change this, I really cringe at the bad practice but oh well
                if(err.name == "BulkWriteError") return console.log("Duplicated data, skipping!");
                else return console.log(err);
            }
            console.log(`Adding new event to the queue with ID: ${event.eventId}`);
            PopularEvents.findOneAndRemove({ "eventId" : req.body.eventID}, (err) => {
                if(err){
                    console.log("Error removing queued event from popular events")
                }
                console.log("Removed queued event from popular event");
                res.status(200).send("Queued event");
            })
        });
    });
}