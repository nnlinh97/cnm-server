var express = require('express');
var router = express.Router();
const followController = require('../controllers/follow');


router.get('/following', followController.following);
router.get('/follower', followController.follower);
router.get('/followerID', followController.followerID);
router.get('/followingID', followController.followingID);


module.exports = router;