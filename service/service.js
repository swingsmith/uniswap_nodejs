let Common= require('ethereumjs-common').default;
let Tx = require('ethereumjs-tx').Transaction;

let web3js = require('../utils/myUtils').getWeb3();
let BigNumber = require('bignumber.js');
let fs = require("fs");
const axios = require('axios');

const customCommon = Common.forCustomChain(
    'mainnet',
    {
        name: 'oatnet',
        networkId: 88,
        chainId: 88,
    },
    'petersburg',
)

let routerAbi = JSON.parse(fs.readFileSync('abi/router.abi'));
let pairAbi = JSON.parse(fs.readFileSync('abi/pair.abi'));
let erc20Abi = JSON.parse(fs.readFileSync('abi/erc20.abi'));
// console.log('start')
// console.log(routerAbi);
// console.log('end')
let wethAddr = '0x5bdd4101020EE226332C647Ac9CdD88fAFB496DE';
let routerContractAddr = "0x11210C16D924A05319599a08a61606ce1F679ec9";
let routerContract = new web3js.eth.Contract(routerAbi, routerContractAddr);
// tokenContract.defaultCommon = {customChain: {name: 'oatnet', chainId: 88, networkId: 88}, baseChain: 'mainnet', hardfork: 'petersburg'};
// console.log(routerContract);

async function getAccountBalance(address){
    let myBalance = await web3js.eth.getBalance(address);

    console.log('balance:'+myBalance.toString())
    return myBalance;

}
async function sendETH(from,to,amount,privateKey){
    var prvKey = new Buffer.from(privateKey, 'hex');

    let nonce = await web3js.eth.getTransactionCount(from);
    console.log('nonce:'+nonce)
    let gasPrice = await web3js.eth.getGasPrice();
    console.log('gasprice:'+gasPrice)
    //let decimals = await routerContract.methods.decimals().call();
    // let balance = number * Math.pow(10, decimals);
    let balance = 50;

    let myBalance = await web3js.eth.getBalance(from);
    console.log('mybalance:'+myBalance);
    //let myBalance = routerContract.methods.balanceOf(fromaddress).call();
    // if (myBalance < balance) {
    //     // ctx.body = fail("余额不足");
    //     return
    // }
    // let tokenData = await routerContract.methods.bid(balance).encodeABI();

    var rawTx = {
        nonce: web3js.utils.numberToHex(nonce),
        gasPrice: web3js.utils.numberToHex(gasPrice),
        gasLimit: '0x52080',
        to: to,
        from: from,
        // chainID: web3.utils.numberToHex(3),
        value: web3js.utils.numberToHex(amount),
        data: '0xabc'//转ｔｏｋｅｎ会用到的一个字段
    };
    // console.log(web3.utils.isHexStrict(web3.utils.numberToHex(nonce)))
    //需要将交易的数据进行预估ｇａｓ计算，然后将ｇａｓ值设置到数据参数中
    // let gas = await web3.eth.estimateGas(rawTx);
    // rawTx.gas = gas;
    // console.log(gas)

    console.log(await web3js.eth.net.getId());
    var tx = new Tx(rawTx,{ common: customCommon });//{chain:'ropsten', hardfork: 'petersburg'}
    tx.sign(prvKey);
    var serializedTx = tx.serialize();

    // console.log(serializedTx.toString('hex'));
    // 0xf889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f
    let data =  await web3js.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(err, data) {
        console.log(err);
        // console.log(data);
    })
    console.log(data);
    console.log(data.transactionHash.toString());
    if (data.status) return data.transactionHash.toString();
    else  return false;
}

//token
async function getBalance(address){
    let myBalance =await routerContract.methods.balanceOf(address).call();

    console.log(myBalance)
    return myBalance;

}

async function transfer(from,to,amount,privateKey){
    // let privatekey = ""
    // let fromaddress =""
    // let toaddress = ""
    var prvKey = new Buffer.from(privateKey, 'hex');

    let nonce = await web3js.eth.getTransactionCount(from);
    console.log('nonce:'+nonce);
    let gasPrice = await web3js.eth.getGasPrice();
    //let decimals = await routerContract.methods.decimals().call();
   // let balance = number * Math.pow(10, decimals);
    let balance = 50;

    // let myBalance = routerContract.methods.getBalance(fromaddress).call();
    let myBalance = await routerContract.methods.balanceOf(from).call();
    if (myBalance < balance) {
        ctx.body = fail("余额不足");
        return
    }
    let tokenData = await routerContract.methods.transfer(to,amount).encodeABI();

    var rawTx = {
        nonce: web3js.utils.numberToHex(nonce),
        gasPrice: web3js.utils.numberToHex(gasPrice),
        gasLimit: '0x52080',
        to: routerContractAddress,
        from: from,
        value: web3js.utils.numberToHex(0),
        data: tokenData//转ｔｏｋｅｎ会用到的一个字段
    };
    //需要将交易的数据进行预估ｇａｓ计算，然后将ｇａｓ值设置到数据参数中
    // let gas = await web3.eth.estimateGas(rawTx);
    // rawTx.gas = gas;
    // console.log(gas)

    var tx = new Tx(rawTx, {'chain':'mainnet'});
    tx.sign(prvKey);
    var serializedTx = tx.serialize();

    // console.log(serializedTx.toString('hex'));
    // 0xf889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f
   let data =  await web3js.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
        console.log(err);
        console.log('hash:'+hash);

    })
    console.log(data);
    if (data.status) return data.transactionHash.toString();
    else  return false;
}

async function getTransactionReceipt(txHash){
    let receipt = await web3js.eth.getTransactionReceipt(txHash)
        // .then(console.log);

    console.log(receipt)
    // return receipt;
    if (!receipt) return false;
    else return true;
}
//token decimals
async function getTokenDecimals(tokenAddress) {
    var token = new web3js.eth.Contract(erc20Abi, tokenAddress);
    var decimals = await token.methods.decimals().call();
    return decimals
}

async function getPairAddress(tokenA, tokenB) {
    var addr = await routerContract.methods.getPairAddress(tokenA, tokenB).call();
    return addr
}

async function getPairAddressETH(token) {
    var addr = await routerContract.methods.getPairAddressETH(token).call();
    return addr
}

async function getReserves(tokenA, tokenB) {
    var rst = await routerContract.methods.getReserves(tokenA, tokenB).call();
    return rst
}
async function getReservesETH(token) {
    var rst = await routerContract.methods.getReserves(token, wethAddr).call();
    return rst
}

async function quote(amountADesired, reserveA, reserveB) {
    var optB = await routerContract.methods.quote(amountADesired, reserveA, reserveB).call();
    return optB
}

async function approveTokenForTokens(token, amount, privateKey) {
    let prvKey = new Buffer.from(privateKey, 'hex');
    let from = await web3js.eth.accounts.privateKeyToAccount(privateKey).address.toString();
    let nonce = await web3js.eth.getTransactionCount(from);
    console.log('nonce:' + nonce);
    let gasPrice = await web3js.eth.getGasPrice();

    let token0 = new web3js.eth.Contract(erc20Abi,token);
    let tokenData = await token0.methods.approve(routerContractAddr, amount).encodeABI();

    var rawTx = {
        nonce: web3js.utils.numberToHex(nonce),
        gasPrice: web3js.utils.numberToHex(gasPrice),
        gasLimit: web3js.utils.numberToHex(60000),
        to: token,
        from: from,
        value: web3js.utils.numberToHex(0),
        data: tokenData//转ｔｏｋｅｎ会用到的一个字段
    };
    //需要将交易的数据进行预估ｇａｓ计算，然后将ｇａｓ值设置到数据参数中
    // let gas = await web3.eth.estimateGas(rawTx);
    // rawTx.gas = gas;
    // console.log(gas)

    var tx = new Tx(rawTx, { common: customCommon });
    tx.sign(prvKey);
    var serializedTx = tx.serialize();

    // console.log(serializedTx.toString('hex'));
    // 0xf889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f
    let data = await web3js.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
        console.log(err);
        console.log('hash:' + hash);

    })
    return data;
}

async function approvePair(pairAddr, amount, privateKey) {
    let prvKey = new Buffer.from(privateKey, 'hex');
    let from = await web3js.eth.accounts.privateKeyToAccount(privateKey).address.toString();
    let nonce = await web3js.eth.getTransactionCount(from);
    console.log('nonce:' + nonce);
    let gasPrice = await web3js.eth.getGasPrice();

    var pair = new web3js.eth.Contract(pairAbi, pairAddr);
    let tokenData = await pair.methods.approve(routerContractAddr, amount).encodeABI();

    var rawTx = {
        nonce: web3js.utils.numberToHex(nonce),
        gasPrice: web3js.utils.numberToHex(gasPrice),
        gasLimit: web3js.utils.numberToHex(60000),
        to: pairAddr,
        from: from,
        value: web3js.utils.numberToHex(0),
        data: tokenData//转ｔｏｋｅｎ会用到的一个字段
    };
    //需要将交易的数据进行预估ｇａｓ计算，然后将ｇａｓ值设置到数据参数中
    // let gas = await web3.eth.estimateGas(rawTx);
    // rawTx.gas = gas;
    // console.log(gas)

    var tx = new Tx(rawTx, {common: customCommon});
    tx.sign(prvKey);
    var serializedTx = tx.serialize();

    // console.log(serializedTx.toString('hex'));
    // 0xf889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f
    let data = await web3js.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
        console.log(err);
        console.log('hash:' + hash);

    })
    return data;
}

async function addLiquidity(tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, to, timeout, privateKey) {
    var deadline = new Date().getTime();
    console.log(deadline)

    let prvKey = new Buffer.from(privateKey, 'hex');
    let from = await web3js.eth.accounts.privateKeyToAccount(privateKey).address.toString();
    let nonce = await web3js.eth.getTransactionCount(from);
    console.log('nonce:' + nonce);
    let gasPrice = await web3js.eth.getGasPrice();

    let tokenData = await routerContract.methods.addLiquidity(
        tokenA,
        tokenB,
        amountADesired,
        amountBDesired,
        amountAMin,
        amountBMin,
        to,
        deadline + timeout
    ).encodeABI();

    var rawTx = {
        nonce: web3js.utils.numberToHex(nonce),
        gasPrice: web3js.utils.numberToHex(gasPrice),
        gasLimit: web3js.utils.numberToHex(3500000),
        to: routerContractAddr,
        from: from,
        value: web3js.utils.numberToHex(0),
        data: tokenData//转ｔｏｋｅｎ会用到的一个字段
    };
    //需要将交易的数据进行预估ｇａｓ计算，然后将ｇａｓ值设置到数据参数中
    // let gas = await web3.eth.estimateGas(rawTx);
    // rawTx.gas = gas;
    // console.log(gas)

    var tx = new Tx(rawTx, {common: customCommon});
    tx.sign(prvKey);
    var serializedTx = tx.serialize();

    // console.log(serializedTx.toString('hex'));
    // 0xf889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f
    let data = await web3js.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
        console.log(err);
        console.log('hash:' + hash);

    })
    return data;
}

async function addLiquidityETH(token, amountTokenDesired, amountETHDesired, amountTokenMin, amountETHMin, to, timeout, privateKey) {
    var deadline = new Date().getTime();
    console.log(deadline)

    let prvKey = new Buffer.from(privateKey, 'hex');
    let from = await web3js.eth.accounts.privateKeyToAccount(privateKey).address.toString();
    let nonce = await web3js.eth.getTransactionCount(from);
    console.log('nonce:' + nonce);
    let gasPrice = await web3js.eth.getGasPrice();

    let tokenData = await routerContract.methods.addLiquidityETH(
        token,
        amountTokenDesired,
        amountTokenMin,
        amountETHMin,
        to,
        deadline + timeout
    ).encodeABI();

    var rawTx = {
        nonce: web3js.utils.numberToHex(nonce),
        gasPrice: web3js.utils.numberToHex(gasPrice),
        gasLimit: web3js.utils.numberToHex(3500000),
        to: routerContractAddr,
        from: from,
        value: web3js.utils.numberToHex(amountETHDesired),
        data: tokenData//转ｔｏｋｅｎ会用到的一个字段
    };
    //需要将交易的数据进行预估ｇａｓ计算，然后将ｇａｓ值设置到数据参数中
    // let gas = await web3.eth.estimateGas(rawTx);
    // rawTx.gas = gas;
    // console.log(gas)

    var tx = new Tx(rawTx, {common: customCommon});
    tx.sign(prvKey);
    var serializedTx = tx.serialize();

    // console.log(serializedTx.toString('hex'));
    // 0xf889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f
    let data = await web3js.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
        console.log(err);
        console.log('hash:' + hash);

    })
    return data;
}

async function swapExactTokensForTokens(amountIn, amountOutMin, path, to, timeout, privateKey) {
    let deadline = new Date().getTime();
    console.log(deadline)

    let prvKey = new Buffer.from(privateKey, 'hex');
    let from = await web3js.eth.accounts.privateKeyToAccount(privateKey).address.toString();
    let nonce = await web3js.eth.getTransactionCount(from);
    console.log('nonce:' + nonce);
    let gasPrice = await web3js.eth.getGasPrice();

    let tokenData = await routerContract.methods.swapExactTokensForTokens(
        amountIn,
        amountOutMin,
        path,
        to,
        deadline + timeout
    ).encodeABI();

    var rawTx = {
        nonce: web3js.utils.numberToHex(nonce),
        gasPrice: web3js.utils.numberToHex(gasPrice),
        gasLimit: web3js.utils.numberToHex(200000),
        to: routerContractAddr,
        from: from,
        value: web3js.utils.numberToHex(0),
        data: tokenData//转ｔｏｋｅｎ会用到的一个字段
    };
    //需要将交易的数据进行预估ｇａｓ计算，然后将ｇａｓ值设置到数据参数中
    // let gas = await web3.eth.estimateGas(rawTx);
    // rawTx.gas = gas;
    // console.log(gas)

    var tx = new Tx(rawTx, {common: customCommon});
    tx.sign(prvKey);
    var serializedTx = tx.serialize();

    // console.log(serializedTx.toString('hex'));
    // 0xf889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f
    let data = await web3js.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
        console.log(err);
        console.log('hash:' + hash);

    })
    return data;
}

async function swapTokensForExactTokens(amountOut, amountInMax, path, to, timeout, privateKey) {
    let deadline = new Date().getTime();
    console.log(deadline)

    let prvKey = new Buffer.from(privateKey, 'hex');
    let from = await web3js.eth.accounts.privateKeyToAccount(privateKey).address.toString();
    let nonce = await web3js.eth.getTransactionCount(from);
    console.log('nonce:' + nonce);
    let gasPrice = await web3js.eth.getGasPrice();

    let tokenData = await routerContract.methods.swapTokensForExactTokens(
        amountOut,
        amountInMax,
        path,
        to,
        deadline + timeout
    ).encodeABI();

    let rawTx = {
        nonce: web3js.utils.numberToHex(nonce),
        gasPrice: web3js.utils.numberToHex(gasPrice),
        gasLimit: web3js.utils.numberToHex(200000),
        to: routerContractAddr,
        from: from,
        value: web3js.utils.numberToHex(0),
        data: tokenData//转ｔｏｋｅｎ会用到的一个字段
    };
    //需要将交易的数据进行预估ｇａｓ计算，然后将ｇａｓ值设置到数据参数中
    // let gas = await web3.eth.estimateGas(rawTx);
    // rawTx.gas = gas;
    // console.log(gas)

    var tx = new Tx(rawTx, {common: customCommon});
    tx.sign(prvKey);
    var serializedTx = tx.serialize();

    // console.log(serializedTx.toString('hex'));
    // 0xf889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f
    let data = await web3js.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
        console.log(err);
        console.log('hash:' + hash);

    })
    return data;
}

async function swapTokensForExactETH(amountOut, amountInMax, path, to, timeout, privateKey) {
    let deadline = new Date().getTime();
    console.log(deadline)

    let prvKey = new Buffer.from(privateKey, 'hex');
    let from = await web3js.eth.accounts.privateKeyToAccount(privateKey).address.toString();
    let nonce = await web3js.eth.getTransactionCount(from);
    console.log('nonce:' + nonce);
    let gasPrice = await web3js.eth.getGasPrice();

    let tokenData = await routerContract.methods.swapTokensForExactETH(
        amountOut,
        amountInMax,
        path,
        to,
        deadline + timeout
    ).encodeABI();

    var rawTx = {
        nonce: web3js.utils.numberToHex(nonce),
        gasPrice: web3js.utils.numberToHex(gasPrice),
        gasLimit: web3js.utils.numberToHex(200000),
        to: routerContractAddr,
        from: from,
        value: web3js.utils.numberToHex(0),
        data: tokenData//转ｔｏｋｅｎ会用到的一个字段
    };
    //需要将交易的数据进行预估ｇａｓ计算，然后将ｇａｓ值设置到数据参数中
    // let gas = await web3.eth.estimateGas(rawTx);
    // rawTx.gas = gas;
    // console.log(gas)

    var tx = new Tx(rawTx, {common: customCommon});
    tx.sign(prvKey);
    var serializedTx = tx.serialize();

    // console.log(serializedTx.toString('hex'));
    // 0xf889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f
    let data = await web3js.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
        console.log(err);
        console.log('hash:' + hash);

    })
    return data;
}

async function swapExactTokensForETH(amountIn, amountOutMin, path, to, timeout, privateKey) {
    let deadline = new Date().getTime();
    console.log(deadline)

    let prvKey = new Buffer.from(privateKey, 'hex');
    let from = await web3js.eth.accounts.privateKeyToAccount(privateKey).address.toString();
    let nonce = await web3js.eth.getTransactionCount(from);
    console.log('nonce:' + nonce);
    let gasPrice = await web3js.eth.getGasPrice();

    let tokenData = await routerContract.methods.swapExactTokensForETH(
        amountIn,
        amountOutMin,
        path,
        to,
        deadline + timeout
    ).encodeABI();

    var rawTx = {
        nonce: web3js.utils.numberToHex(nonce),
        gasPrice: web3js.utils.numberToHex(gasPrice),
        gasLimit: web3js.utils.numberToHex(200000),
        to: routerContractAddr,
        from: from,
        value: web3js.utils.numberToHex(0),
        data: tokenData//转ｔｏｋｅｎ会用到的一个字段
    };
    //需要将交易的数据进行预估ｇａｓ计算，然后将ｇａｓ值设置到数据参数中
    // let gas = await web3.eth.estimateGas(rawTx);
    // rawTx.gas = gas;
    // console.log(gas)

    var tx = new Tx(rawTx, {common: customCommon});
    tx.sign(prvKey);
    var serializedTx = tx.serialize();

    // console.log(serializedTx.toString('hex'));
    // 0xf889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f
    let data = await web3js.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
        console.log(err);
        console.log('hash:' + hash);

    })
    return data;
}

async function swapExactETHForTokens(amountIn, amountOutMin, path, to, timeout, privateKey) {
    let deadline = new Date().getTime();
    console.log(deadline)

    let prvKey = new Buffer.from(privateKey, 'hex');
    let from = await web3js.eth.accounts.privateKeyToAccount(privateKey).address.toString();
    let nonce = await web3js.eth.getTransactionCount(from);
    console.log('nonce:' + nonce);
    let gasPrice = await web3js.eth.getGasPrice();

    let tokenData = await routerContract.methods.swapExactETHForTokens(
        amountOutMin,
        path,
        to,
        deadline + timeout
    ).encodeABI();

    var rawTx = {
        nonce: web3js.utils.numberToHex(nonce),
        gasPrice: web3js.utils.numberToHex(gasPrice),
        gasLimit: web3js.utils.numberToHex(200000),
        to: routerContractAddr,
        from: from,
        value: web3js.utils.numberToHex(amountIn),
        data: tokenData//转ｔｏｋｅｎ会用到的一个字段
    };
    //需要将交易的数据进行预估ｇａｓ计算，然后将ｇａｓ值设置到数据参数中
    // let gas = await web3.eth.estimateGas(rawTx);
    // rawTx.gas = gas;
    // console.log(gas)

    var tx = new Tx(rawTx, {common: customCommon});
    tx.sign(prvKey);
    var serializedTx = tx.serialize();

    // console.log(serializedTx.toString('hex'));
    // 0xf889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f
    let data = await web3js.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
        console.log(err);
        console.log('hash:' + hash);

    })
    return data;
}

async function swapETHForExactTokens(amountIn, amountOut, path, to, timeout, privateKey) {
    let deadline = new Date().getTime();
    console.log(deadline)

    let prvKey = new Buffer.from(privateKey, 'hex');
    let from = await web3js.eth.accounts.privateKeyToAccount(privateKey).address.toString();
    let nonce = await web3js.eth.getTransactionCount(from);
    console.log('nonce:' + nonce);
    let gasPrice = await web3js.eth.getGasPrice();

    let tokenData = await routerContract.methods.swapETHForExactTokens(
        amountOut,
        path,
        to,
        deadline + timeout
    ).encodeABI();

    var rawTx = {
        nonce: web3js.utils.numberToHex(nonce),
        gasPrice: web3js.utils.numberToHex(gasPrice),
        gasLimit: web3js.utils.numberToHex(200000),
        to: routerContractAddr,
        from: from,
        value: web3js.utils.numberToHex(amountIn),
        data: tokenData//转ｔｏｋｅｎ会用到的一个字段
    };
    //需要将交易的数据进行预估ｇａｓ计算，然后将ｇａｓ值设置到数据参数中
    // let gas = await web3.eth.estimateGas(rawTx);
    // rawTx.gas = gas;
    // console.log(gas)

    var tx = new Tx(rawTx, {common: customCommon});
    tx.sign(prvKey);
    var serializedTx = tx.serialize();

    // console.log(serializedTx.toString('hex'));
    // 0xf889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f
    let data = await web3js.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
        console.log(err);
        console.log('hash:' + hash);

    })
    return data;
}

async function removeLiquidity(tokenA, tokenB, liquidity, amountAMin, amountBMin, to, timeout, privateKey) {

    let deadline = new Date().getTime();
    console.log(deadline)

    let prvKey = new Buffer.from(privateKey, 'hex');
    let from = await web3js.eth.accounts.privateKeyToAccount(privateKey).address.toString();
    let nonce = await web3js.eth.getTransactionCount(from);
    console.log('nonce:' + nonce);
    let gasPrice = await web3js.eth.getGasPrice();

    let tokenData = await routerContract.methods.removeLiquidity(
        tokenA,
        tokenB,
        liquidity,
        amountAMin,
        amountBMin,
        to,
        deadline + timeout
    ).encodeABI();

    let rawTx = {
        nonce: web3js.utils.numberToHex(nonce),
        gasPrice: web3js.utils.numberToHex(gasPrice),
        gasLimit: web3js.utils.numberToHex(3500000),
        to: routerContractAddr,
        from: from,
        value: web3js.utils.numberToHex(0),
        data: tokenData//转ｔｏｋｅｎ会用到的一个字段
    };
    //需要将交易的数据进行预估ｇａｓ计算，然后将ｇａｓ值设置到数据参数中
    // let gas = await web3.eth.estimateGas(rawTx);
    // rawTx.gas = gas;
    // console.log(gas)

    var tx = new Tx(rawTx, {common: customCommon});
    tx.sign(prvKey);
    var serializedTx = tx.serialize();

    // console.log(serializedTx.toString('hex'));
    // 0xf889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f
    let data = await web3js.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
        console.log(err);
        console.log('hash:' + hash);

    })
    return data;
}

async function removeLiquidityETH(token, liquidity, amountTokenMin, amountETHMin, to, timeout, privateKey) {
    let deadline = new Date().getTime();
    console.log(deadline)

    let prvKey = new Buffer.from(privateKey, 'hex');
    let from = await web3js.eth.accounts.privateKeyToAccount(privateKey).address.toString();
    let nonce = await web3js.eth.getTransactionCount(from);
    console.log('nonce:' + nonce);
    let gasPrice = await web3js.eth.getGasPrice();

    let tokenData = await routerContract.methods.removeLiquidityETH(
        token,
        liquidity,
        amountTokenMin,
        amountETHMin,
        to,
        deadline + timeout
    ).encodeABI();

    let rawTx = {
        nonce: web3js.utils.numberToHex(nonce),
        gasPrice: web3js.utils.numberToHex(gasPrice),
        gasLimit: web3js.utils.numberToHex(3500000),
        to: routerContractAddr,
        from: from,
        value: web3js.utils.numberToHex(0),
        data: tokenData//转ｔｏｋｅｎ会用到的一个字段
    };
    //需要将交易的数据进行预估ｇａｓ计算，然后将ｇａｓ值设置到数据参数中
    // let gas = await web3.eth.estimateGas(rawTx);
    // rawTx.gas = gas;
    // console.log(gas)

    var tx = new Tx(rawTx, {common: customCommon});
    tx.sign(prvKey);
    var serializedTx = tx.serialize();

    // console.log(serializedTx.toString('hex'));
    // 0xf889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f
    let data = await web3js.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
        console.log(err);
        console.log('hash:' + hash);

    })
    return data;
}

async function factory() {
    var fac = await routerContract.methods.factory().call();
    return fac
}

async function WETH() {
    var w = await routerContract.methods.WETH().call();
    return w
}

async function getAmountsIn(amountOut, path) {
    // var path2 = ['0xE2CA27EEC49aB292D2d62837010E38A212718f49','0xCdE0559a1EB30051F2A9316871aa72C7946EAd93'];
    var rst = await routerContract.methods.getAmountsIn(amountOut, path).call();
    console.log(rst)
    return rst
}

async function getAmountsOut(amountIn, path) {
    // var path = ["0xE2CA27EEC49aB292D2d62837010E38A212718f49","0xCdE0559a1EB30051F2A9316871aa72C7946EAd93"];
    var rst = await routerContract.methods.getAmountsOut(amountIn, path).call();
    return rst
}

//pair
async function getTotalLiquidity(pair) {
    var pairContract = new web3js.eth.Contract(pairAbi, pair);
    // var deadline = new Date().getTime();
    var total = await pairContract.methods.totalSupply().call();
    return total
}

async function getPersonalLiquidity(pair, owner) {
    var pairContract = new web3js.eth.Contract(pairAbi, pair);
    // var deadline = new Date().getTime();
    var liqiudity = await pairContract.methods.balanceOf(owner).call();
    return liqiudity
}

async function getTokenList() {
    let list = JSON.parse(fs.readFileSync('tokenlist.json'));
    return list
}

async function getPrivateKeyByUserID(userID) {
    let res = await axios.get('http://192.168.1.224:8081/getPrivateKey?userid=' + userID)
    if (res.status == 200) return res.data.data
    else return ''
}


module.exports ={
    getAccountBalance,
    sendETH,
    getBalance,
    transfer,
    getTransactionReceipt,
    getTokenDecimals,
    getPairAddress,
    getAmountsOut,
    getAmountsIn,
    getPairAddressETH,
    getTotalLiquidity,
    getPersonalLiquidity,
    getReserves,
    getReservesETH,
    addLiquidity,
    addLiquidityETH,
    swapExactTokensForETH,
    swapETHForExactTokens,
    swapTokensForExactETH,
    swapExactETHForTokens,
    swapExactTokensForTokens,
    swapTokensForExactTokens,
    removeLiquidity,
    removeLiquidityETH,
    approveTokenForTokens,
    approvePair,
    quote,
    factory,
    WETH,
    getTokenList,
    getPrivateKeyByUserID
}
