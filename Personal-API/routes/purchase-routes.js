var express = require('express');
var router = express.Router();
var purchaseController = require('../controllers/purchase-controller.js');


// Post Routes
router.post('/input-new-event', purchaseController.inputNewEvent);
router.post('/update-purchase-price', purchaseController.updatePurchasePrice);
router.post('/update-listing-price', purchaseController.updateListingPrice);
router.post('/update-resale-price', purchaseController.updateResalePrice);

// Get Routes
router.get('/get-purchased-events', purchaseController.getPurchasedEvents);

module.exports = router;