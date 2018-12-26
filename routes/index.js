
var express = require('express');
var router = express.Router();
const indexController = require('../controllers/index');

//router send request to node
router.post('/request', indexController.sendRequest);
router.post('/request/image', indexController.requestImage);

module.exports = router;
