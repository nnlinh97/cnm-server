const axios = require('axios');
const { RpcClient } = require('tendermint');

exports.sendRequest = (req, res) => {
    if (req.body && req.body.tx) {
        const client = RpcClient('https://komodo.forest.network:443');
        client.broadcastTxCommit({ tx: req.body.tx }).then((res) => {
            console.log(res);
            if (+res.height !== 0) {
                res.status(200).json({
                    message: 'success'
                })
            } else {
                res.status(500).json({
                    message: 'fail'
                });
            }
        });
        // axios.get(`https://komodo.forest.network/broadcast_tx_commit?tx=${req.body.tx}`).then(res => {
        //     console.log(res.data.result);
        //     if(res.data.result.height != 0){
        //         console.log('success');
        //         res.json({
        //             status: 200,
        //             message: 'success'
        //         });
        //     }else {
        //         console.log('==0');
        //         res.json({
        //             status: 500,
        //             message: 'fail'
        //         });
        //     }
        // }).catch((err) => {
        //     console.log('fail');
        //     res.json({
        //         status: 500,
        //         message: 'fail',
        //         error: err
        //     })
        // })
    } else {
        res.status(500).json({
            status: 500,
            message: 'fail'
        });
    }
}