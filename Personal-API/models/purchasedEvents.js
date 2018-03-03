var mongoose = require('mongoose');

module.exports = mongoose.model('purchasedTickets', {
    eventId: {type: "String", required: true, unique: true},
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
    category1: {type: "String", required: false},
    category2: {type: "String", required: false},
    category3: {type: "String", required: false},
    queryParameter: {type: "String", required: false},
    onsaleStartDateTime: {type: "String", required: true},
    onsaleEndDateTime: {type: "String", required: true},
    purchasePrice: {type: "Number", required: true},
    listingPrice: {type: "Number", required: false}
});
