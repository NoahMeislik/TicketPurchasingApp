const path = require('path');
const config = require(path.resolve('./config/config.js'))

//Models
const ticket = require(config.personalApiPaths.models.ticket);

module.exports.getPurchasedTickets = function(req, res){
    ticket.find({},(err,tickets) => {
        if(err) return res.status(500).send("Unable to query tickets at this time");
        res.json({
            purchasedTickets: tickets
        });
    });
}

module.exports.insertNewTicket = function(req, res){
        if (!req.body.eventName || !req.body.purchasePrice || !req.body.resalePrice || !req.body.resaleLink) return res.status(400).send("You forgot a field.");
        let ticketToInsert = {
            eventName: req.body.eventName,
            purchasePrice: req.body.purchasePrice,
            resalePrice: req.body.resalePrice,
            resaleLink: req.body.resaleLink,
        };
        console.log(ticketToInsert);

        let ticket = new QueuedEvent(eventToQueue);
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
}

module.exports.getEventById = function(req, res){
    if(!req.query.eventId){
        return res.status(400).send("Specify an event Id please");
    }
    PopularEvents.findOne({eventId:req.query.eventId}, function(err, event){
        if(err){
            return res.status(500).send("Unable to query event data at this time")
        }

        res.json({
            event: event
        })
    })
}