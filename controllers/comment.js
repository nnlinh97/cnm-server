const commentRepo = require('../repos/comment');


exports.getCommentByHash = (req, res) => {
    if(req.query && req.query.hash){
        commentRepo.getCommentByHash(req.query.hash).then(reaction => {
            if(reaction){
                res.json({
                    status: 200,
                    result: reaction,
                    message: 'success'
                })
            } else {
                res.json({
                    status: 500,
                    result: null,
                    message: 'not found'
                })
            } 
        })
    } else {
        res.json({
            status: 500,
            message: 'invalid params'
        })
    }
}