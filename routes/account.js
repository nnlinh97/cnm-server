
var express = require('express');
var router = express.Router();
const accountController = require('../controllers/account');

//router send request to node
router.get('/get-account', accountController.getAccount);

module.exports = router;
