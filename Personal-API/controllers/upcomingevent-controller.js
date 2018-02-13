const path = require('path');
const config = require(path.resolve('./config/config.js'))
const upcomingEvents = require(config.personalApiPaths.models.upcomingEvents);



module.exports.getUpcomingEvents = function(req, res){
    upcomingEvents.find({},(err,events) => {
        if(err) return res.status(500).send("Unable to query upcoming events at this time");
        res.json({
            upcomingEvents: events
        });
    });
}

module.exports.searchUpcomingEvents = function(req, res){
    upcomingEvents.find({"eventName": /.*Lil skies.*/}, (err, events) => {
        if(err) return res.status(500).send("Unable to query your search");
        res.json({
            events: events
        })
    })
}

