var express = require('express');
var router = express.Router();
const userController = require('../controllers/users');


router.post('/login', userController.login);
router.post('/payment', userController.payment);
router.post('/create-account', userController.createAcount);

router.get('/get-list-users', userController.getListUsers );
router.get('/get-user', userController.getUser);
router.get('/get-info', userController.getInfo);

module.exports = router;