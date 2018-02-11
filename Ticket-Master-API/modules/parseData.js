const zlib = require('zlib')
const oboe = require('oboe')
const got = require('got')
const path = require('path')
const config = require(path.resolve('./config/config.js'))
const url = `http://app.ticketmaster.com/dc/feeds/v1/events.json?apikey=${config.apiKey}`
const gunzip = zlib.createGunzip()

// init mongo connection
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoDB);


// TODO: Need to organise this model better, need to retrieve the data that needs to be inserted into the collection
const Ticket = mongoose.model('security_archives', mongoose.Schema({
  eventId: String,
  primaryEventUrl: String,
  resaleEventUrl: String,
  eventName: String,
  eventNotes: String,
  eventStatus: String,
  eventImageUrl: String,
  eventStartDateTime: String,
  eventEndDateTime: String,
  eventStartLocalDate: String,
  venue: Array,
  minPrice: Double,
  maxPrice: Double,
  onsaleStartDateTime: String,
  onsaleEndDateTime: String,
}));

let downloadData = function(){
  let eventsOnSale = 0;
  got.stream(url).pipe(gunzip);
  oboe(gunzip).node('events.*', event => {
    let status = event.eventStatus;
    if (status == "onsale")
    {
      // need to also check time here and do the insert.
    }
  });
}


downloadData();
