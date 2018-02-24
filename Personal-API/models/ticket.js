var mongoose = require('mongoose');

module.exports = mongoose.model('queuedEvents', {
    eventName: {type: "String", required: true},
    purchasePrice: {type: "Number", required: true},
    resalePrice: {type: "Number", required: true},
    resaleLink: {type: "String", required: false},
});