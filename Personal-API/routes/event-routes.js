var express = require('express');
var router = express.Router();
var eventController = require('../controllers/upcomingevent-controller.js');

//Post Routes
router.get('/get-upcoming-events', eventController.getUpcomingEvents);

//Get Routes
//router.get('/get-user', userController.getUser);

module.exports = router;