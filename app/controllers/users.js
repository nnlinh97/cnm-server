const SHA256 = require("crypto-js/sha256");
const db = require('../config/dbConfig');
const user = db.user;

exports.create = (req, res) => {
    user.findAll({
        where: {
            email: req.body.email
        }
    }).then((users) => {
        if (users.length === 0) {
            const newUser = {
                email: req.body.email,
                password: SHA256(req.body.password).toString(),
            }
            user.create(newUser).then((user) => {
                res.status(200).json({
                    message: 'create user successfully',
                    user: user
                })
            }).catch((err) => {
                res.status(500).json({
                    message: err
                });
            });
        } else {
            res.status(400).json({
                message: "Email aready exists"
            });
        }
    });
}
