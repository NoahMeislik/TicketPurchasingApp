var mongoose = require('mongoose');

module.exports = mongoose.model('popularartists', {
    artistName: {type: "String", required: true},
    popularity: {type: "Number", required: false},
});
