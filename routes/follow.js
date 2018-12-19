var express = require('express');
var router = express.Router();
const followController = require('../controllers/follow');


router.get('/following', followController.following);
router.get('/follower', followController.follower);


module.exports = router;