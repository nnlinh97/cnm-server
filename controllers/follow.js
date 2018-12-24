const followRepo = require('../repos/follow');
const userRepo = require('../repos/user');
const accountRepo = require('../repos/account');


exports.following = (req, res) => {
    if (req.query && req.query.idKey) {
        followRepo.getListFollower(req.query.idKey).then((result) => {
            if (result.length > 0) {
                let accounts = [];
                let users = [];
                result.forEach(item => {
                    accounts.push(accountRepo.getAccountV1(item.follower));
                    users.push(userRepo.getUser(item.follower));
                });
                Promise.all(accounts).then((pAccounts) => {
                    Promise.all(users).then((pUsers) => {
                        for (let i = 0; i < pAccounts.length; i++) {
                            pUsers[i].displayName = pAccounts[i] ? pAccounts[i].displayName : '';
                            pUsers[i].avatar = pAccounts[i] ? pAccounts[i].avatar : '';
                        }
                        res.json({
                            status: 200,
                            result: pUsers,
                            count: pUsers.length,
                            message: 'success'
                        });
                    })
                })
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
            message: 'invalid params or not found'
        });
    }
}
exports.followingID = (req, res) => {
    if (req.query && req.query.idKey) {
        followRepo.getListFollower(req.query.idKey).then((result) => {
            if (result) {
                let follows = [];
                result.forEach(item => {
                    follows.push(item.follower);
                });
                res.json({
                    status: 200,
                    result: follows,
                    count: follows.length,
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
            message: 'invalid params or not found'
        });
    }
}

exports.follower = (req, res) => {
    if (req.query && req.query.idKey) {
        followRepo.getListFollowings(req.query.idKey).then((result) => {
            if (result) {
                let accounts = [];
                let users = [];
                result.forEach(item => {
                    accounts.push(accountRepo.getAccountV1(item.following));
                    users.push(userRepo.getUser(item.following));
                });
                Promise.all(accounts).then((pAccounts) => {
                    Promise.all(users).then((pUsers) => {
                        for (let i = 0; i < pAccounts.length; i++) {
                            pUsers[i].displayName = pAccounts[i] ? pAccounts[i].displayName : '';
                            pUsers[i].avatar = pAccounts[i] ? pAccounts[i].avatar : '';
                        }
                        res.json({
                            status: 200,
                            result: pUsers,
                            count: pUsers.length,
                            message: 'success'
                        });
                    })
                })
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

exports.followerID = (req, res) => {
    if (req.query && req.query.idKey) {
        followRepo.getListFollowings(req.query.idKey).then((result) => {
            if (result) {
                let follows = [];
                result.forEach(item => {
                    follows.push(item.following);
                });
                res.json({
                    result: follows,
                    count: follows.length,
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
            message: 'invalid params or not found'
        });
    }
}
