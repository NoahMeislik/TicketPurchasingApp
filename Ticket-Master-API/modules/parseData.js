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
  let eventsOnSale = 0;
  got.stream(url).pipe(gunzip);
  oboe(gunzip).node('events.*', event => {
    
    // If eventStartTime is before the current date (already happened) then we don't want to add that however if it is after the current date then we insert
    let eventStartTime = moment(event.onsaleEndDateTime);
    let eventStartTimeBefore = moment(event.onsaleEndDateTime, "YYYY-MM-DDTHH:mm:ssZ").subtract(1, 'days');
    let eventSaleTime = event.onsaleStartDateTime;

    console.log(event);
    console.log(eventStartTime);
    console.log(eventStartTime.diff(eventStartTimeBefore,'days'));

    
    

    // if (eventStartTime)
    // {
    //   let ticketObject = {
    //     eventId: event.eventId,
    //     primaryEventUrl: event.primaryEventUrl,
    //     resaleEventUrl: event.resaleEventUrl,
    //     eventName: event.eventName,
    //     eventNotes: event.eventNotes,
    //     eventStatus: event.eventStatus,
    //     eventImageUrl: event.eventImageUrl,
    //     eventStartDateTime: event.eventStartDateTime,
    //     eventEndDateTime: event.eventEndDateTime,
    //     eventStartLocalDate: event.eventStartLocalDate,
    //     venue: event.venue,
    //     minPrice: event.minPrice,
    //     maxPrice: event.maxPrice,
    //     onsaleStartDateTime: event.onsaleStartDateTime,
    //     onsaleEndDateTime: event.onsaleEndDateTime,
    //   };
    //   let ticket = new Ticket(ticketObject);
    //   ticket.save(function(err){
    //       if(err){
    //           return console.log(err);
    //       }

    //       return console.log("Inserted");
    //   })
    // }
  });
}


downloadData();
