const accountRepo = require('../repos/account');

exports.getAccount = (req, res) => {
    if(req.body && req.body.idKey){
        accountRepo.getAccountV1(req.body.idKey).then(account => {
            if(account){
                res.status(200).json({
                    result: account,
                    message: 'success'
                })
            } else {
                res.status(200).json({
                    message: 'not found',
                    result: null
                });
            }
        }).catch((err) => {
            res.status(500).json({
                message: 'query fail',
                error: err
            });
        })
    }else {
        res.status(500).json({
            message: 'invalid params'
        });
    }
}