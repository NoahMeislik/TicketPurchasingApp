var express = require('express');
var router = express.Router();
var artistController = require('../controllers/artists-controller.js');

// Get Routes
router.get('/get-popular-artists', artistController.getPopularArtists);



module.exports = router;