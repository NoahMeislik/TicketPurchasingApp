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


// Use of the Route
app.use('/user', userRoutes);
app.use('/events', eventRoutes);
app.use('/artists', artistRoutes);

app.listen(config.port, function(){
    console.log("Server Running on Port: 3000")
})


//--/////////////////////--//
//--    TicketMasterAPI    --//
//--////////////////////--//

// Run reparse and update the db at 12 every night
schedule.scheduleJob('0 0 * * *', () => {
    console.log("Streaming event data from file");
    let parseModule = require('./Ticket-Master-API/modules/parseData.js');
})


//--/////////////////////--//
//--    SpotifyAPI      --//
//--////////////////////--//

schedule.scheduleJob('0 0 * * 0', () => {
    console.log("Getting new artists on spotify");
    let spotifyModule = require(config.spotifyApi.modules.getArtists);
})