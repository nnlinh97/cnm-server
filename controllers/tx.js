const txRepo = require('../repos/transaction');
const { decodePost } = require('../lib/tx/v1');

exports.getListTxs = (req, res) => {
    if (req.query && req.query.idKey) {
        txRepo.getListTxs(req.query.idKey).then((txs) => {
            if (txs) {
                txs.forEach(item => {
                    item.tx = JSON.parse(item.tx);
                });
                res.json({
                    status: 500,
                    result: txs,
                    count: txs.length,
                    message: 'success'
                });
            } else {
                res.json({
                    status: 500,
                    result: null,
                    message: 'not found'
                });
            }
        })
    } else {
        res.json({
            status: 500,
            message: 'invalid params'
        });
    }
}