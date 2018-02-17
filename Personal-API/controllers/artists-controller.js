const path = require('path');
const config = require(path.resolve('./config/config.js'))
const artists = require(config.personalApiPaths.models.artists);


module.exports.getPopularArtists = function(req, res){
    artists.find({},(err,artists) => {
        if(err) return res.status(500).send("Unable to query artists at this time");
        res.json({
            artists: artists
        });
    });
}