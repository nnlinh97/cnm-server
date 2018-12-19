
var express = require('express');
var router = express.Router();
const indexController = require('../controllers/index');

//router send request to node
router.get('/request', indexController.sendRequest);

module.exports = router;
