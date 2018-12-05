var express = require('express');
var router = express.Router();
const userController = require('../controllers/users');


router.post('/register', userController.create);
router.get('/', userController.getListUsers);

module.exports = router;