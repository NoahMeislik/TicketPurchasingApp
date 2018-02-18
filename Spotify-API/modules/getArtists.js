
const path = require('path');
const config = require(path.resolve('./config/config.js'))
const artists = require(config.personalApiPaths.models.artists);
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoDB);
const SpotifyWebApi = require("spotify-web-api-node");
var Artist = require(config.personalApiPaths.models.artists);


var limit = 100,
    current = 0;

// credentials are optional
var spotify = new SpotifyWebApi({
  clientId : 'c3bab349867a444997e28f81bbb66862',
  clientSecret : '94f42b3de9d9426781604386536669cd',
});

var clientId = 'c3bab349867a444997e28f81bbb66862',
    clientSecret = '94f42b3de9d9426781604386536669cd';


// Retrieve an access token.

let initSpotify = function(){
  spotify.clientCredentialsGrant()
  .then(function(data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotify.setAccessToken(data.body['access_token']);
    fetchArtists();
  }, function(err) {
        console.log('Something went wrong when retrieving an access token', err);
  });
}


let fetchArtists = function() {
  console.log("Current " + current + " of " + limit);
  if (current < config.spotifyApi.maxPage) {
    spotify.searchArtists("year:2012-2018", {limit: 20, offset: current})
    .then(function(results) {
      if (results) {
      limit = results.body.artists.total;
      var ids = results.body.artists.items.map(function(artist) { return artist.id});
      spotify.getArtists(ids).then(function(results) {
        results.body.artists.forEach(function(i) {
            if (!artist) {
              var artist = new Artist({
                id: i.id,
                name: i.name,
                followers: i.followers.total,
                popularity: i.popularity
              });

              if (i.followers.total > config.spotifyApi.followerLimit && i.popularity >= config.spotifyApi.popularityLimit)
              {
                artist.save(function(err) {
                    if (err) {
                      console.log("Artist already in database");
                    } 
                    
                    else {
                      console.log('saved ', i.name);
                    }
                });
              }
            }

        });
      });

      current += 20;
      if (current < limit) {
        setTimeout(function() {
          fetchArtists();
        }, 1000);
      }
    }
    });
  }
}

initSpotify();