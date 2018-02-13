var express = require('express');
var router = express.Router();
var eventController = require('../controllers/upcomingevent-controller.js');

// Get Routes
router.get('/get-upcoming-events', eventController.getUpcomingEvents);

router.post('/search-upcoming-events', eventController.searchUpcomingEvents);


module.exports = router;