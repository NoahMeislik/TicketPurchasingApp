const path = require('path');
const config = require(path.resolve('./config/config.js'))
const popularArtists = require(config.personalApiPaths.models.popularArtists);



module.exports.getPopularArtists = function(req, res){
    popularArtists.find({},(err,artists) => {
        if(err) return res.status(500).send("Unable to query popular artists at this time");
        res.json({
            popularArtists: artists
        });
    });
}

