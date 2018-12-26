const axios = require('axios');
const _ = require('lodash');
const querystring = require('querystring');
const { RpcClient } = require('tendermint');


exports.sendRequest = (req, res) => {
    if (req.body && req.body.tx) {
        const client = RpcClient('https://komodo.forest.network:443');
        client.broadcastTxCommit({ tx: req.body.tx }).then((result) => {
            if (+result.height !== 0) {
                res.status(200).json({
                    message: 'success'
                })
            } else {
                res.status(200).json({
                    message: 'fail'
                });
            }
        })
    } else {
        res.status(500).json({
            status: 500,
            message: 'fail'
        });
    }
}

exports.requestImage = (req, res) => {
    if (req.body && req.body.tx) {
        const body = _.get(req, 'body');
        // console.log(body);
        let data = { tx: req.body.tx };
        // console.log(querystring.stringify({tx: body.tx}));
        const contentType = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        axios.post('https://dragonfly.forest.network/broadcast_tx_commit', querystring.stringify({ tx: body.tx }), contentType).then((res) => {
            console.log(res.data.result);
            if (+res.data.result.height !== 0) {
                res.status(200).json({
                    message: 'success'
                })
            } else {
                res.status(200).json({
                    message: 'fail'
                })
            }
        })
    } else {
        res.status(500).json({
            status: 500,
            message: 'fail'
        });
    }
}