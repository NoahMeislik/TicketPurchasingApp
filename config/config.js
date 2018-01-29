const path = require('path')
module.exports = {
    apiKey : "8ggd773EzUJqQ6TK4ypOoHp6FePW0nmq",
    eventSearchTimer : 86400*1000,
    mongoDB: "mongodb://test:test@ds117868.mlab.com:17868/ticket-price-interpreter",
    createUserToken : "This is a meme and a half!",
    APP_SECRET : "This is also a meme and a half!",
    ticketMasterPaths: {
        previousEventData : path.resolve('./Ticket-Master-API/data/eventdata/previousEventData.json'),
    },
    personalApiPaths : {
        models: {
            user : path.resolve('./Personal-API/models/user.js'),
            upcomingEvents : path.resolve('./Personal-API/models/upcomingEvents.js')
        },
        routes: {
            userRoutes : path.resolve('./Personal-API/routes/user-routes.js')
        }
    }
}