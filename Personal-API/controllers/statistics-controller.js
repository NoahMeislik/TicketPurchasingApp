const path = require('path');
const config = require(path.resolve('./config/config.js'))

//Models
const PurchasedEvent = require(config.personalApiPaths.models.purchasedEvents)

module.exports.getProfitStatistics = function (req, res) {
    PurchasedEvent.find({}, (err, events) => {
        let totalResales = 0;
        let totalPurchased = 0;
        let profit = 0;
        for (let i = 0; i < events.length; i++) {
            totalResales += events[i].resalePrice;
            totalPurchased += events[i].purchasePrice;
            profit = totalResales - totalPurchased;
        }
        res.json({
            profit: profit
        })
    });
}

module.exports.getStatistics = function (req, res) {
    PurchasedEvent.find({}, (err, events) => {
        let data = [[],[]];
        for (let i = 0; i < events.length; i++) {
            data[0].push(events[i].purchasePrice)
            data[1].push(events[i].resalePrice)
        }
        res.json({
            data: data
        })
    });
}