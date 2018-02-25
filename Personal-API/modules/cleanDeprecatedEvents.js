const request = require('request');
const mongoose = require('mongoose');
const path = require('path')
const moment = require('moment')
const config = require(path.resolve('./config/config.js'))
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoDB);

 //Models
const PopularEvent = require(config.personalApiPaths.models.popularEvents)
const upcomingEvents = require(config.personalApiPaths.models.upcomingEvents);
const queuedEvents = require(config.personalApiPaths.models.queuedEvents);


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

    //clean from upcoming events
    upcomingEvents.find({}, (err, events) => {
        for (let i = 0; i < events.length; i++) {
            let onsaleStartDateTime = events[i].onsaleStartDateTime;
            onsaleStartDateTime = moment(onsaleStartDateTime, "YYYY-MM-DDTHH:mm:ssZ");
            let difference = onsaleStartDateTime.diff(Date.now(), 'days');
            if (difference < 0)
            {
                upcomingEvents.findOneAndRemove({eventId: events[i].eventId}, function(err){
                    console.log(`Removed event with ID ${events[i].eventId}`);
                    if (err) return console.log(err);
                });
            }
        }
    });

}


module.exports = {
    cleanDeprecatedEvents: cleanDeprecatedEvents
};