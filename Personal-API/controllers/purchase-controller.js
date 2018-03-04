const path = require('path');
const config = require(path.resolve('./config/config.js'))

//Models
const upcomingEvents = require(config.personalApiPaths.models.upcomingEvents);
const artists = require(config.personalApiPaths.models.artists);
const QueuedEvent = require(config.personalApiPaths.models.queuedEvents);
const PopularEvents = require(config.personalApiPaths.models.popularEvents)
const PurchasedEvent = require(config.personalApiPaths.models.purchasedEvents)

module.exports.purchaseEvent = function(req, res){
    if(!req.body.eventId){
        return res.status(400).send("Specify an event Id please")
    }
    console.log(req.body.listingPrice)

    PurchasedEvent.findOne({eventId:req.body.eventId}, function(err, purchasedEvent){
        if(!purchasedEvent){
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
                    listingPrice: req.body.listingPrice
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
            })  
        }
        if(purchasedEvent){
            PurchasedEvent.findOneAndUpdate({eventId:req.body.eventId}, {listingPrice: req.body.listingPrice}, function(err){
                if(err){
                    console.log(err)
                    return res.status(500).send("Unable to update listingPrice")
                }
                console.log(`Updated listing price of event with id: ${req.body.eventId}`)
                QueuedEvent.findOneAndRemove({eventId:req.body.eventId}, function(err){
                    if(err){
                        console.log(err)
                    }
                })
            })

        }
    })
}

module.exports.inputNewEvent = function(req, res){
    if(!req.body.eventId || !req.body.purchasePrice){
        return res.status(400).send("Specify an event Id please")
    }
    QueuedEvent.findOne({eventId:req.body.eventId}, function(err, event){
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
            listingPrice: req.body.listingPrice,
            resalePrice: req.body.resalePrice
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
    })
}

module.exports.updatePurchasePrice = function(req, res){
    if(!req.body.eventId || !req.body.purchasePrice){
        return res.status(400).send("Specify an event Id please")
    }

    PurchasedEvent.findOneAndUpdate({eventId:req.body.eventId}, {purchasePrice:req.body.purchasePrice}, function(err){
        if(err){
            return res.status(500).send("There was an error updating the purchase price")
        }
        console.log(`Updated purchase price of event with id: ${req.body.eventId}`)
    })
}

module.exports.updateListingPrice = function(req, res){
    if(!req.body.eventId || !req.body.listingPrice){
        return res.status(400).send("Specify an event Id please")
    }

    PurchasedEvent.findOneAndUpdate({eventId:req.body.eventId}, {listingPrice:req.body.listingPrice}, function(err){
        if(err){
            return res.status(500).send("There was an error updating the listing price")
        }
        console.log(`Updated listing price of event with id: ${req.body.eventId}`)
    })
}


module.exports.updateResalePrice = function(req, res){
    if(!req.body.eventId || !req.body.resalePrice){
        return res.status(400).send("Specify an event Id please")
    }

    PurchasedEvent.findOneAndUpdate({eventId:req.body.eventId}, {listingPrice:req.body.resalePrice}, function(err){
        if(err){
            return res.status(500).send("There was an error updating the resale price")
        }
        console.log(`Updated resale price of event with id: ${req.body.eventId}`)
    })
}
