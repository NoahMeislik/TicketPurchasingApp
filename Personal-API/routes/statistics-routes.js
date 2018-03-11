var express = require('express');
var router = express.Router();
var statisticsController = require('../controllers/statistics-controller.js');


// Get Routes
router.get('/get-profit', statisticsController.getProfitStatistics);
router.get('/get-data', statisticsController.getStatistics);


module.exports = router;