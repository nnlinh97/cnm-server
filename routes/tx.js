var express = require('express');
var router = express.Router();
const txController = require('../controllers/tx');

//list post cua then idKey
router.get('/', txController.getListTxs);

//get detail post
// router.get('/get-post', postController.getPost);



module.exports = router;