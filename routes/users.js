var express = require('express');
var router = express.Router();
const userController = require('../controllers/users');


router.post('/login', userController.login);
router.post('/payment', userController.payment);
module.exports = router;