// //var express = require('express');
// //var router = express.Router();
// var request = require("request");
//
// /* GET home page. */
// router.get('/',  (req, res, next) => {
//     var headers = {
//         'User-Agent': 'Super Agent/0.0.1',
//         'Content-Type': 'application/x-www-form-urlencoded',
//         'Accept': 'application/json-rpc',
//         'keyname':'xx'
//     };
//
//     var options = {
//         url: "http://192.168.20.131:8088",
//         method: 'POST',
//         headers: headers,
//         form: {jsonrpc:'{"method": "ses/user/stringme", "params": ["XXXXX"], "id": 4}'}
//     };
//
//     request(options, function (error, response, body) {
//         res.render("index", {title:res.statusCode.toString() + " " + body});
//     });
// });


const redis = require('redis');
const moment = require('moment')
let   bluebird = require("bluebird");
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const redisLink = 'redis://159.138.42.32:6379'
const pwd = 'Redis@1234'
const opts = {
    auth_pass: pwd,
}
const client = redis.createClient(redisLink ,opts);



client.on('error',function (err) {
    console.log('redis错误:'+err)
});

client.on('connect',function () {
    console.log('redis连接成功...');
});


async function getInfo() {
    //SMEMBERS
    let data = await client.hsetAsync("zztest","man")
    console.log(data)
}

getInfo()