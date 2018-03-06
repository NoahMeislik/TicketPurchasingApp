var express = require('express');
var bodyParse = require('body-parser');
var mongoose = require('mongoose');
var schedule = require('node-schedule');
const config = require('./config/config.js')
var app = express();
mongoose.connect(config.mongoDB);

app.use('/', express.static(__dirname + '/client'));
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended: true}));

process.env.APP_SECRET = config.appSecret;


//--/////////////////////--//
//--    Personal API    --//
//--////////////////////--//
//Routes
var userRoutes = require(config.personalApiPaths.routes.userRoutes);
var eventRoutes = require(config.personalApiPaths.routes.eventRoutes);
var artistRoutes = require(config.personalApiPaths.routes.artistRoutes);
var purchaseRoutes = require(config.personalApiPaths.routes.purchaseRoutes);
var statisticRoutes = require(config.personalApiPaths.routes.statisticsRoute);


//Modules
let cleanDeprecatedModule = require(config.personalApiPaths.modules.cleanDeprecatedEvents);


// Use of the Route
app.use('/user', userRoutes);
app.use('/events', eventRoutes);
app.use('/artists', artistRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/statistics', statisticRoutes);


app.listen(config.port, function(){
    console.log(`Server Running on Port: ${config.port}`)
})

schedule.scheduleJob('*/10 * * * *', () => {
    console.log("Cleaning up deprecated events.");
    cleanDeprecatedModule.cleanDeprecatedEvents();
})



//--/////////////////////--//
//--    TicketMasterAPI    --//
//--////////////////////--//
let parseModule = require(config.ticketMasterApi.modules.parseData);
let getPopularEventsModule = require(config.ticketMasterApi.modules.getPopularEvents);

// Run reparse and update the db at 12 every night
schedule.scheduleJob('0 0 * * *', () => {
    console.log("Streaming event data from file");
    parseModule.downloadData();
})

// Get popular events at 12:30 every night
schedule.scheduleJob('30 0 * * *', () => {
    console.log("Grabbing popular events")
    getPopularEventsModule.getPopularEvents();
})


//--/////////////////////--//
//--    SpotifyAPI      --//
//--////////////////////--//
let spotifyModule = require(config.spotifyApi.modules.getArtists);
// Get's popular artists at 10pm every sunday
schedule.scheduleJob('0 22 * * 0', () => {
    console.log("Getting new artists on spotify");
    spotifyModule.initSpotify();
});

