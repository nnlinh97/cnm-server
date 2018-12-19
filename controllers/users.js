const SHA256 = require("crypto-js/sha256");
const userRepo = require('../repos/user');


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