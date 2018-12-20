const txRepo = require('../repos/transaction');
const { decodePost } = require('../lib/tx/v1');

exports.getListTxs = (req, res) => {
    if (req.body && req.body.idKey) {
        txRepo.getListTxs(req.body.idKey).then((txs) => {
            if (txs) {
                txs.forEach(item => {
                    item.tx = JSON.parse(item.tx);
                });
                res.status(200).json({
                    result: txs,
                    count: txs.length,
                    message: 'success'
                });
            } else {
                res.status(200).json({
                    result: null,
                    message: 'not found'
                });
            }
        }).catch((err) => {
            res.status(500).json({
                message: 'query fail',
                error: err
            });
        });
    } else {
        res.status(500).json({
            message: 'invalid params'
        });
    }
}