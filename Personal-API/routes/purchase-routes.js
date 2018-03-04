var express = require('express');
var router = express.Router();
var purchaseController = require('../controllers/purchase-controller.js');

// Get Routes

// Post Routes
router.post('/input-new-event', purchaseController.inputNewEvent);
router.post('/update-purchase-price', purchaseController.updatePurchasePrice);

module.exports = router;