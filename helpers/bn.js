let BigNumber = require('bignumber.js')

let add = function() {
    let res = new BigNumber(0)
    for (let a of arguments) {
        res = res.plus(a)
    }
    return res
}

let minus = (a, b) => {
    return new BigNumber(a).minus(b)
}

let multiply = function() {
    let res = new BigNumber(1)
    for (let a of arguments) {
        res = res.multipliedBy(a)
    }
    return res
}

let div = (a, b) => {
    return new BigNumber(a).dividedBy(b)
}

module.exports = {
    add,
    minus,
    multiply,
    div
}