var mongoose = require('mongoose');

module.exports = mongoose.model('user', {
    username: {type: "String", unique: true, required: true},
    email : {type: "String", unique: true, required: true},
    password: {type: "String", required: true},
    isAdmin: {type: "Boolean", required: true}
});