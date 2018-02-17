var express = require('express');
var router = express.Router();
var eventController = require('../controllers/event-controller.js');

// Get Routes
router.get('/get-upcoming-events', eventController.getUpcomingEvents);

router.get('/get-popular-events', eventController.getPopularEvents);

router.post('/queue-event', eventController.queueEvent);


module.exports = router;