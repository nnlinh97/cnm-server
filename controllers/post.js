const postRepo = require('../repos/post');

exports.getListPosts = (req, res) => {
    if (req.body && req.body.idKey) {
        postRepo.getListPosts(req.body.idKey).then((posts) => {
            if (posts) {
                res.status(200).json({
                    result: posts,
                    count: posts.length,
                    message: 'success'
                });
            } else {
                res.status(200).json({
                    result: null,
                    message: 'not found'
                });
            }
        })
    } else {
        res.status(500).json({
            message: 'invalid params'
        });
    }
}

exports.getPost = (req, res) => {
    if (req.body && req.body.idPost) {
        postRepo.getPost(req.body.idPost).then((post) => {
            if (post) {
                res.status(200).json({
                    result: post,
                    message: 'success'
                });
            } else {
                res.status(200).json({
                    result: null,
                    message: 'not found'
                });
            }
        })
    } else {
        res.status(500).json({
            message: 'invalid params'
        });
    }
}