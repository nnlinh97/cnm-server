var express = require('express');
var router = express.Router();
const commentController = require('../controllers/comment');


router.get('/', commentController.getCommentByHash);

module.exports = router;