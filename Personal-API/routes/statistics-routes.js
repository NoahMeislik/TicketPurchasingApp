var express = require('express');
var router = express.Router();
var statisticsController = require('../controllers/statistics-controller.js');


// Get Routes
router.get('/get-profit', statisticsController.getProfitStatistics);

module.exports = router;