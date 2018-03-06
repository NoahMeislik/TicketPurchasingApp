const path = require('path')
module.exports = {
    apiKey : "8ggd773EzUJqQ6TK4ypOoHp6FePW0nmq",
    mongoDB: "mongodb://test:test@ds023455.mlab.com:23455/ticket-price-interpreter",
    createUserToken : "This is a meme and a half!",
    appSecret : "This is also a meme and a half!",
    port: 3000,
    personalApiPaths : {
        models: {
            user : path.resolve('./Personal-API/models/user.js'),
            upcomingEvents : path.resolve('./Personal-API/models/upcomingEvents.js'),
            artists : path.resolve('./Personal-API/models/popularArtists.js'),
            popularEvents : path.resolve('./Personal-API/models/popularEvents.js'),
            queuedEvents : path.resolve('./Personal-API/models/queuedEvents.js'),
            purchasedEvents : path.resolve('./Personal-API/models/purchasedEvents.js')
        },
        routes: {
            eventRoutes : path.resolve('./Personal-API/routes/event-routes.js'),
            userRoutes : path.resolve('./Personal-API/routes/user-routes.js'),
            artistRoutes : path.resolve('./Personal-API/routes/artists-routes.js'),
            purchaseRoutes : path.resolve('./Personal-API/routes/purchase-routes.js'),
            statisticsRoute: path.resolve('./Personal-API/routes/statistics-routes.js')
        },
        modules: {
            cleanDeprecatedEvents: path.resolve('./Personal-API/modules/cleanDeprecatedEvents.js'),
        }
    },
    ticketMasterApi:{
        dateDifference: 0, // 4 days before
        modules: {
            parseData: path.resolve('./Ticket-Master-API/modules/parseData.js'),
            getPopularEvents: path.resolve('./Ticket-Master-API/modules/getPopularEvents.js')
        }
    },
    spotifyApi: {
        popularityLimit: 80,
        followerLimit: 150000,
        maxPage: 100000,
        modules: {
            getArtists: path.resolve('./Spotify-API/modules/getArtists.js'),
        }
    },
    webAutomater: {
        username: 'noah.meislik@gmail.com',
        password: 'carrera996',
        loginPage: 'https://www.stubhub.com/my/profile'
    }

}