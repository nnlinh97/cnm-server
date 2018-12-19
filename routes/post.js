var express = require('express');
var router = express.Router();
const postController = require('../controllers/post');

//list post cua then idKey
router.get('/get-list-posts', postController.getListPosts);

//get detail post
router.get('/get-post', postController.getPost);



module.exports = router;