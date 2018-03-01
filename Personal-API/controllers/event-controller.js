const path = require('path');
const config = require(path.resolve('./config/config.js'))

//Models
const upcomingEvents = require(config.personalApiPaths.models.upcomingEvents);
const artists = require(config.personalApiPaths.models.artists);
const QueuedEvent = require(config.personalApiPaths.models.queuedEvents);
const PopularEvents = require(config.personalApiPaths.models.popularEvents)
const PurchasedEvent = require(config.personalApiPaths.models.purchasedEvents)


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

module.exports.getEventById = function(req, res){
    if(!req.query.eventId){
        return res.status(400).send("Specify an event Id please");
    }

    PopularEvents.findOne({eventId:req.query.eventId}, function(err, event){
        if(err){
            return res.status(500).send("Unable to query event data at this time")
        }
        if (event)
        {
            res.json({
                event: event
            })
        } else {
            QueuedEvent.findOne({eventId:req.query.eventId}, function(err, queuedEvent){
                if (queuedEvent){
                    res.json({
                        event:queuedEvent
                    })
                }
            })
        }

    })
}

module.exports.purchaseEvent = function(req, res){
    if(!req.body.eventId || !req.body.purchasePrice){
        return res.status(400).send("Specify an event Id please")
    }

    QueuedEvent.findOne({eventId:req.body.eventId}, function(err, event){
        if(err){
            return res.status(500).send("Unable to query event data at this time")
        }

        let eventToPurchase = {
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
            purchasePrice: req.body.purchasePrice,

        };

        let purchasedEvent = new PurchasedEvent(eventToPurchase);
        purchasedEvent.save(function(err){
            if (err){
                if(err.name == "BulkWriteError") return console.log("Duplicated data, skipping!");
                else return res.status(500).send("Unable to save new purchased Event")
            }
            console.log(`Adding new event to the purchased with ID: ${event.eventId}`);
            res.status(200).send("Added new event to purchased")
            QueuedEvent.findOneAndRemove({eventId:req.body.eventId}, function(err){
                if(err){
                    console.log(err)
                }
            })
        })

        if (!event){
            console.log("There is no queued event for this purchase")
        }


    });
}

