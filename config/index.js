// 开发环境
var dev = require('./dev');

// 测试环境
var test = require('./test');

// 正式环境
var pro = require('./pro');

var env = process.env.NODE_ENV || 'dev';

console.log('运行环境：' + env)
var configs = {
    dev,
    test,
    pro,
};

const config = Object.assign({}, { env }, configs[env])

module.exports = config;