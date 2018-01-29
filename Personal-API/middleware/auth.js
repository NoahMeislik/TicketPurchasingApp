const path = require('path');
const config = require(path.resolve('./config/config.js'));
var jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
    if (!req.headers['token']){
        return res.status(400).send("Please include a valid token");
    }

    var token = req.headers.token;

    jwt.verify(token, config.APP_SECRET, function(err, decoded){
        if (err){
            return res.status(400).send("Please specify a valid token");
        }

        req.user = decoded;
        next();
    });
}