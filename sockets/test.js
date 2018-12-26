const { decodePost, decodeFollow, decodeType, decodeReact } = require('../lib/tx/v1');

let a = new Buffer("AQAOcndnYXJmZ2ZkZ3NkZ2Q=", "base64");

console.log(decodePost(a))