let router = require('express').Router();
// let ethersUtils = require('../utils/ethersUtils');
// let codeUtil = require('../utils/code')
const BigNumber = require('bignumber.js');
let actionService = require('../service/service');
let web3js = require('../utils/myUtils').getWeb3();
// console.log('ether:'+ethersUtils.sha256(codeUtil.hexStr2byteArray('0x12345')))
// //stone
// let privateKey = 'e15ce4218d9101de9c08b5580b9fb831143f9d8f1ba16dab5d9154e508364caa';
// let address = actionService.getAddressFromPrivateKey(privateKey);
// console.log(address)

// let address = '0xaDc4806C2e31EB540Dd793980473A935fa960274';
// let privateKey = "de71c1da35b76034e461cc026692b5f9083928e73d1fb4e464a519a102883f53";
// let balance= actionService.getAccountBalance(address);
// console.log(balance.toString());

let from = '0xaDc4806C2e31EB540Dd793980473A935fa960274';
let to   = '0xF0fA6CB72F67150647486665C46fC368849d6479';
let amount = web3js.utils.toWei('1000',"ether")
let privateKey = '6770b371c41292d2599c7e4f0e153b9ab4d435d0848ba41530856c6f32e6fbf0';

let tokenA = "0x4BAf4Fb4Ce33497f528bE2eFe13FA8EAA59720bE";
let tokenB = "0x59C2a7e2Db9d45Ee8B0285224691074A9cD85fAa";
let wethAddr = '0x5bdd4101020EE226332C647Ac9CdD88fAFB496DE';
let amountA = web3js.utils.toWei('1000000',"ether");
let amountB = web3js.utils.toWei('0.01',"ether");
let amountAMin = web3js.utils.toWei('10000',"ether");
let amountBMin = web3js.utils.toWei('0.001',"ether");

let timeout = 30*60*1000;
let path = [tokenA,wethAddr];

async function main() {
    // let balance = await actionService.getAccountBalance(from);
    // // console.log(actionService.getAccountBalance(from))
    // console.log(balance)
    //
    // let decimals = await actionService.getTokenDecimals(tokenA);
    // console.log(decimals);
    //
    // let pair = await actionService.getPairAddress(tokenA,tokenB);
    // console.log(pair);
    //
    // let addr = web3js.eth.accounts.privateKeyToAccount(privateKey).address;
    // console.log(addr)

    // await actionService.approveTokenForTokens(tokenA,amountA,privateKey)
    // await actionService.approveTokenForTokens(tokenB,amountB,privateKey)
    //
    // await actionService.addLiquidity(tokenA,tokenB,amountA,amountB,amountAMin,amountBMin,from,timeout,privateKey)

    // var fac = await actionService.factory();
    // console.log('fac: '+fac.toString())
    //
    // var w = await actionService.WETH()
    // console.log('w: '+w.toString())
    //
     var rst =await actionService.getReserves(tokenA,tokenB);
     console.log(rst)
    // var optB = await actionService.quote(amountA,rst.reserveA,rst.reserveB)
    // console.log(optB)
    // let amounts = await actionService.getAmountsOut(amountA,path);
    // console.log(amounts);
    // await actionService.approveTokenForTokens(tokenA,amountA,privateKey);
    // await actionService.swapExactTokensForTokens(amountA,amounts[1],path,from,timeout,privateKey);

    // let amounts = await actionService.getAmountsIn(amountB,path)
    // await actionService.approveTokenForTokens(tokenA,amounts[0],privateKey)
    // await actionService.swapTokensForExactTokens(amountB,amounts[0],path,from,timeout,privateKey)

    // var pairAddr = await actionService.getPairAddress(tokenA, tokenB);
    // console.log("pairAddr: "+pairAddr.toString());
    // var total = await actionService.getTotalLiquidity(pairAddr.toString())
    // console.log("total: "+total.toString())
    // var personal = await actionService.getPersonalLiquidity(pairAddr.toString(),from)
    // console.log("personal: "+personal.toString())

    // await actionService.approvePair(pairAddr, personal, privateKey);
    // await actionService.removeLiquidity(tokenA,tokenB,personal,amountAMin,amountBMin,from,timeout,privateKey);

}
async function mainETH() {
    // let balance = await actionService.getAccountBalance(from);
    // // console.log(actionService.getAccountBalance(from))
    // console.log(balance)
    //
    // let decimals = await actionService.getTokenDecimals(tokenA);
    // console.log(decimals);
    //
    // let pair = await actionService.getPairAddress(tokenA,tokenB);
    // console.log(pair);
    //
    // let addr = web3js.eth.accounts.privateKeyToAccount(privateKey).address;
    // console.log(addr)

    // await actionService.approveTokenForTokens(tokenA,amountA,privateKey)
    // await actionService.addLiquidityETH(tokenA,amountA,amountB,amountAMin,amountBMin,from,timeout,privateKey)

    // var fac = await actionService.factory();
    // console.log('fac: '+fac.toString())
    //
    // var w = await actionService.WETH()
    // console.log('w: '+w.toString())
    //
    //  var rst =await actionService.getReserves(tokenA,wethAddr);
    //  console.log(rst)
    // var optB = await actionService.quote(amountA,rst.reserveA,rst.reserveB)
    // console.log(optB)

    // let amounts = await actionService.getAmountsOut(amountA,path);
    // console.log(amounts);
    // await actionService.approveTokenForTokens(tokenA,amountA,privateKey);
    // await actionService.swapExactTokensForETH(amountA,amounts[1],path,from,timeout,privateKey)

    // let amounts = await actionService.getAmountsIn(amountB,path)
    // console.log(amounts)
    // await actionService.approveTokenForTokens(tokenA,amounts[0],privateKey)
    // await actionService.swapTokensForExactETH(amountB,amounts[0],path,from,timeout,privateKey)

    // let amounts = await actionService.getAmountsOut(amountB,path);
    // console.log(amounts);
    // await actionService.swapExactETHForTokens(amountB,amounts[1],path,from,timeout,privateKey);

    // let amounts = await actionService.getAmountsIn(amountA,path)
    // console.log(amounts)
    // await actionService.swapETHForExactTokens(amounts[0],amountA,path,from,timeout,privateKey)

    // var pairAddr = await actionService.getPairAddressETH(tokenA);
    // console.log("pairAddr: "+pairAddr.toString());
    // var total = await actionService.getTotalLiquidity(pairAddr.toString())
    // console.log("total: "+total.toString())
    // var personal = await actionService.getPersonalLiquidity(pairAddr.toString(),from)
    // console.log("personal: "+personal.toString())
    //
    // await actionService.approvePair(pairAddr, personal, privateKey);
    // await actionService.removeLiquidityETH(tokenA,personal,amountAMin,amountBMin,from,timeout,privateKey)

    let prv = await actionService.getPrivateKeyByUserID('3606585338782058')
    console.log('prv:'+prv)
}
mainETH();
