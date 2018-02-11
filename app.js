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


//--/////////////////////--//
//--    Personal API    --//
//--////////////////////--//
//Routes
var userRoutes = require(config.personalApiPaths.routes.userRoutes);

// Use of the Route
app.use('/user', userRoutes);

// app.post('/thread',  )
app.listen(config.port, function(){
    console.log("Server Running on Port: 3000")
})


//--/////////////////////--//
//--    TicketMasterAPI    --//
//--////////////////////--//
const parseData = require('./Ticket-Master-API/modules/parseData.js');

// Run reparse and update the db at 12 every night
schedule.scheduleJob('0 0 * * *', () => {
    console.log("Streaming event data from file");
    downloadData();
})