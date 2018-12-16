import transaction from './tx/index';

const privateKey = "SA3CRYDZO732G7FSMSSQOJ5FAJRWZELGLEKFBO6XQ4TJQWASMFK4SSM3";
const publicKey = "GAXVLYJUYND6QKGHK4FGM44XK3U77KJY54VTUJNIORYASOUOHWO63Q7Q";
const address = "GCWHALH3HH6SRSRSUKVIXMU5SQKUY46ZQNDHIJC2GJK6RGIYTF7JEB3E";

const tx = {
    version: 1,
    sequence: 1,
    memo: Buffer.alloc(0),
    account: publicKey,
    operation: "payment",
    params: {
        address: address,
        amount: 100
    },
    signature: new Buffer(64)
}

transaction.sign(tx, privateKey);
const txEncode = transaction.encode(tx).toString('hex');