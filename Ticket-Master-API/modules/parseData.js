const zlib = require('zlib')
const oboe = require('oboe')
const got = require('got')
const path = require('path')
const moment = require('moment')
const config = require(path.resolve('./config/config.js'))
const url = `http://app.ticketmaster.com/dc/feeds/v1/events.json?apikey=${config.apiKey}`
const gunzip = zlib.createGunzip()


// init mongo connection
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoDB);

const Ticket = require(config.personalApiPaths.models.upcomingEvents);


let downloadData = function(){
  got.stream(url).pipe(gunzip);
  oboe(gunzip).node('events.*', event => {
    // Check if the actual event has a onsaleStarDate
    let onsaleStartDateTime = event.onsaleStartDateTime;
    if (onsaleStartDateTime !== null) {
      // Subtract one day from the onsalestartdatetime to see if it goes on sale within a day
      onsaleStartDateTime = moment(onsaleStartDateTime, "YYYY-MM-DDTHH:mm:ssZ");
      let difference = onsaleStartDateTime.diff(Date.now(),'days')
      if (difference > 0)
      {
        if (event.eventStartDateTime) {
          let ticketObject = {
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
            onsaleStartDateTime: event.onsaleStartDateTime,
            onsaleEndDateTime: event.onsaleEndDateTime,
          };
          let ticket = new Ticket(ticketObject);
          ticket.save(function(err){

              if(err){
                  // TODO: Change this, I really cringe at the bad practice but oh well
                  if(err.name == "BulkWriteError") return console.log("Duplicated data, skipping!");
                  else return console.log(err.name);
              }

              console.log(`Adding new event to the datbase with ID: ${event.eventId}`);
          });
        }
      }
    }
  });
}


// downloadData();
