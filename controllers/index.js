const axios = require('axios');

exports.sendRequest = (req, res) => {
    if (req.body && req.body.tx) {
        axios.get(`https://komodo.forest.network/broadcast_tx_commit?tx=${tx}`).then(res => {
            if(+res.data.result.height !== 0){
                res.status(200).json({
                    message: 'SUCCESS'
                });
            }else {
                res.status(200).json({
                    message: 'FAIL'
                });
            }
        })
    } else {
        res.status(200).json({
            message: 'FAIL'
        });
    }
}