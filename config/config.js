const path = require('path')
module.exports = {
    apiKey : "8ggd773EzUJqQ6TK4ypOoHp6FePW0nmq",
    mongoDB: "mongodb://test:test@ds117868.mlab.com:17868/ticket-price-interpreter",
    createUserToken : "This is a meme and a half!",
    appSecret : "This is also a meme and a half!",
    port: 3000,
    personalApiPaths : {
        models: {
            user : path.resolve('./Personal-API/models/user.js'),
            upcomingEvents : path.resolve('./Personal-API/models/upcomingEvents.js'),
            popularArtists : path.resolve('./Personal-API/models/popularArtists.js')
        },
        routes: {
            eventRoutes : path.resolve('./Personal-API/routes/event-routes.js'),
            userRoutes : path.resolve('./Personal-API/routes/user-routes.js'),
            popularArtists : path.resolve('./Personal-API/routes/artists-routes.js'),
        }
    }
}