var express = require('express');
var router = express.Router();
const userController = require('../controllers/users');


router.post('/register', userController.create);

module.exports = router;