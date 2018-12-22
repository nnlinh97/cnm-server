const postRepo = require('../repos/post');
const followRepo = require('../repos/follow');

exports.getListPosts = (req, res) => {
    if (req.query && req.query.idKey) {
        postRepo.getListPosts(req.query.idKey).then((posts) => {
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
    if (req.query && req.query.idPost) {
        postRepo.getPost(req.query.idPost).then((post) => {
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
        res.status(200).json({
            message: 'invalid params',
            result: null
        });
    }
}

exports.getNewfeed = (req, res) => {
    if (req.query && req.query.idKey) {
        followRepo.getListFollower(req.query.idKey).then((result) => {
            let follow = [];
            follow.push(req.query.idKey);
            result.forEach(item => {
                follow.push(item.follower);
            });
            let promise = [];
            follow.forEach(item => {
                promise.push(postRepo.getListPosts(item));
            });
            Promise.all(promise).then((pResult) => {
                let follows = [];
                pResult.forEach(item => {
                    if (item.length) {
                        item.forEach(element => {
                            follows.push(element);
                        });
                    }
                });
                res.status(200).json({
                    count: follows.length,
                    message: 'success',
                    result: follows
                });
            }).catch((err) => {
                res.status(500).json({
                    message: 'query fail',
                    error: err
                });
            })
        }).catch((err) => {
            res.status(500).json({
                message: 'query fail',
                error: err
            });
        })
    } else {
        res.status(500).json({
            message: 'invalid params'
        });
    }
}