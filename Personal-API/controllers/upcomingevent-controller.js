const path = require('path');
const config = require(path.resolve('./config/config.js'))
var UpcomingEvent = require(config.personalApiPaths.models.upcomingEvents);
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
    if (!req.body.search) return res.status(400).send("You did not provide search parameters")
    upcomingEvents.find(
        {'upcomingEvents' : [
            {$search: req.body.search}
        ]}, (err, events) => {
        if(err) return res.status(500).send("Unable to query your search");
        res.json({
            upcomingEvents: events
        })
    })
}

