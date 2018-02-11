var mongoose = require('mongoose');

module.exports = mongoose.model('upcomingEvent', {
    eventId: {type: "String", required: true},
    primaryEventUrl: {type: "String", required: true},
    resaleEventUrl: {type: "String", required: false},
    eventName: {type: "String", required: true},
    eventNotes: {type: "String", required: false},
    eventStatus: {type: "String", required: true},
    eventImageUrl: {type: "String", required: true},
    eventStartDateTime: {type: "String", required: true},
    eventEndDateTime: {type: "String", required: false},
    eventStartLocalDate: {type: "String", required: true},
    venue: {type: "Array", required: true},
    minPrice: {type: "Number", required: false},
    maxPrice: {type: "Number", required: false},
    onsaleStartDateTime: {type: "String", required: true},
    onsaleEndDateTime: {type: "String", required: true},
});

/*
name: {type: "String", unique: true, required: true},
    type : {type: "String", unique: true, required: true},
    id: {type: "String", required: true},
    location: {type: "String", required: true},//Location will include city and state
    url: {type: "String", required: true},
    venueName: {type: "String", required: true},
    venueLink: {type: "String", required: true},
    seatMap: {type: "String", required: false},//not required as some venues create seating and do not have a map
    eventDate: {type: "Date", required: true},
    onSaleStartTime: {type: "Date", required: true},
    topSeatPicks: {type: "Array", required: false},//not required as events that are not onsale yet do not have recommended seating and seats recommended are shit
*/