var express = require('express');
var bodyParse = require('body-parser');
var mongoose = require('mongoose');
const config = require('./config/config.js')

var app = express();

mongoose.connect(config.mongoDB);

app.use('/', express.static(__dirname + '/client'));

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended: true}));


//Routes
var userRoutes = require(config.personalApiPaths.routes.userRoutes);

//Use of the Route
app.use('/user', userRoutes);


// app.post('/thread',  )

app.listen(3000, function(){
    console.log("Server Running on Port: 3000")
})






const eventSearch = require('./Ticket-Master-API/modules/eventsearch.js');
