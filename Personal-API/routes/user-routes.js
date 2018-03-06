var express = require('express');
var router = express.Router();
var userController = require('../controllers/user-controller.js');

//Post Routes
router.post('/create-user', userController.createUser);
router.post('/login-user', userController.loginUser);
router.post('/get-user-data', userController.getUserData);

//Get Routes
//router.get('/get-user', userController.getUser);

module.exports = router;