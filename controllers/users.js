const SHA256 = require("crypto-js/sha256");
const userRepo = require('../repos/user');
const axios = require('axios');


exports.login = (req, res) => {
    const idKey = req.body.publicKey;
    userRepo.getUser(idKey).then((user) => {
        res.status(200).json({
            user: user
        });
    }).catch((err) => {
        res.status(500).json({
            message: err
        })
    })
}

exports.payment = (req, res) => {
    res.json({
        message: 'payment'
    })
}

exports.createAcount = (req, res) => {
    if (req.body && req.body.tx) {
        axios.get(`https://komodo.forest.network/broadcast_tx_commit?tx=${tx}`).then(res => {
            if (+res.data.result.height !== 0) {
                res.status(200).json({
                    message: 'SUCCESS'
                });
            } else {
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

exports.getListUsers = (req, res) => {
    if (req.body) {
        const page = req.body.page ? req.body.page : 1;
        const limit = req.body.limit ? req.body.limit : 10;
        const offset = (page - 1) * limit;
        userRepo.getListUsers({
            offset,
            limit
        }).then(users => {
            res.status(200).json({
                count: result.length,
                result: users,
                message: 'success'
            });
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

exports.getUser = (req, res) => {
    if(req.query && req.query.idKey){
        userRepo.getUser(req.query.idKey).then(user => {
            if(user){
                res.json({
                    status: 200,
                    result: user,
                    message: 'success'
                })
            } else {
                res.json({
                    status: 500,
                    message: 'not found',
                });
            }
        }).catch((err) => {
            res.json({
                status: 500,
                message: 'query fail',
                error: err
            });
        })

    }else {
        res.json({
            status: 500,
            message: 'invalid params',
        });
    }
}