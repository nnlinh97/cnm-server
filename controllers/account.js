const accountRepo = require('../repos/account');

exports.getAccount = (req, res) => {
    if(req.query && req.query.idKey){
        accountRepo.getAccountV1(req.query.idKey).then(account => {
            if(account){
                res.json({
                    status: 200,
                    result: account,
                    message: 'success'
                })
            } else {
                res.json({
                    status: 500,
                    message: 'not found'
                });
            }
        })
    }else {
        res.json({
            status: 500,
            message: 'invalid params'
        });
    }
}