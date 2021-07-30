let Redis = require("ioredis");
let koaLogger = require("./koa-logger")
let DB = require("./DB")
global.cfg = require('../config')
global.moment = require('moment')
global.axios = require("axios");
global.bn = require("./bn");
global.isIntAddress = require('./isValidAddress')
global.biut = require('./biut')
global.proxy = require('./proxy')
global.getUsdtPrice = require('./getUsdtPrice')
global.db = new DB(cfg.mysql)
global.vipCoinDb = new DB(cfg.vipCoinMysql)
global.redis = new Redis(cfg.redis)
global.strTrim = str => (str || "").replace(/(^\s*)|(\s*$)/g, "")

let trim = async (ctx, next) => {
    let params = ctx.request.method == "GET" ? ctx.request.query : ctx.request.body;
    let run = param => {
        for (let p in param) {
            if (typeof param[p] == "string") {
                param[p] = strTrim(param[p])
            } else if (typeof param[p] == "object") {
                run(param[p])
            }
        }
    }
    run(params);
    await next();
}

let logs = async (ctx, next) => {
    let ip = ctx.req.headers['x-forwarded-for'] ||
        ctx.req.connection.remoteAddress ||
        ctx.req.socket.remoteAddress ||
        ctx.req.connection.socket.remoteAddress;
    let method = ctx.request.method;
    let oTime = Date.now();
    let url = ctx.request.url.split('?')[0];
    let authToken = ctx.req.headers['access-auth-token']
    let address = '';
    if (authToken) {
        let user = await redis.get(authToken);
        user = JSON.parse(user)
        address = user && user.address ? user.address : ''
    }
    let params = JSON.stringify(ctx.request.method == "GET" ? ctx.request.query : ctx.request.body);
    try {
        await next();
        let err = (ctx.body && ctx.body.code) ? (ctx.body.message || '') : '';
        db.create(`insert into walletlogs (ip,address,oTime,method,url,des,err,type,status,params,errDetail) values (?)`, [
            [ip, address, oTime, method, url, '', err, err ? 2 : 1, ctx.response.status, params, (JSON.stringify(ctx.body)).length > 5000 ? '' : JSON.stringify(ctx.body)]
        ])
    } catch (e) {
        console.log(e)
        db.create(`insert into walletlogs (ip,address,oTime,method,url,des,err,type,status,params,errDetail) values (?)`, [
            [ip, address, oTime, method, url, '', e.message, 3, ctx.response.status, params, JSON.stringify(e.stack)]
        ])
        ctx.body = { code: 500, message: '系统异常' }
    }
}

module.exports = {
    koaLogger,
    trim,
    logs,
    trim
}