const commentRepo = require('../repos/comment');
const { decodePost, decodeFollow, decodeType, decodeReact } = require('../lib/tx/v1');


exports.getCommentByHash = (req, res) => {
    if(req.query && req.query.hash){
        commentRepo.getCommentByHash(req.query.hash).then(reaction => {
            
            if(reaction){
                reaction.forEach(item => {
                    item.text = decodePost(new Buffer(item.text, "base64")).text;
                });
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