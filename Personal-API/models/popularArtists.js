var mongoose = require('mongoose');

module.exports = mongoose.model('artists', {
    id: {type: "String", required: true, unique: true},
    name: {type: "String", required: true},
    followers: {type: "String", required: true},
    popularity: {type: "Number", required: true},
});
