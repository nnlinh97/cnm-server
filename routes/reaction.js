var express = require('express');
var router = express.Router();
const reactionController = require('../controllers/reaction');


router.get('/', reactionController.getReactionByHash);



module.exports = router;