let router = require('express').Router();
let actionService = require('../service/service');

// const privateKey = "6770b371c41292d2599c7e4f0e153b9ab4d435d0848ba41530856c6f32e6fbf0";

router.post('/getTokenList',async(req,res)=>{
    let list=  await actionService.getTokenList()
    let rst = {
        "code": 200,
        "msg":"成功",
        "data": {
            "list":list
        }
    }
    res.send(rst)
});

router.post('/getTokenDecimals',async(req,res)=>{
    if (!req.body.token) res.send({"code": 3000, "msg":"参数错误", "data": {}})
    let dec=  await actionService.getTokenDecimals(req.body.token)
    let rst = {
        "code": 200,
        "msg":"成功",
        "data": {
            "decimals":dec
        }
    }
    res.send(rst)
});

router.post('/getPairAddress',async(req,res)=>{
    if (!req.body.tokenA || !req.body.tokenB) res.send({"code": 3000, "msg":"参数错误", "data": {}})
    let addr =  await actionService.getPairAddress(req.body.tokenA, req.body.tokenB)
    let rst = {
        "code": 200,
        "msg":"成功",
        "data": {
            "address":addr
        }
    }
    res.send(rst)
});

router.post('/getPairAddressETH',async(req,res)=>{
    if (!req.body.token) res.send({"code": 3000, "msg":"参数错误", "data": {}})
    let addr =  await actionService.getPairAddressETH(req.body.token)
    let rst = {
        "code": 200,
        "msg":"成功",
        "data": {
            "address":addr
        }
    }
    res.send(rst)
});

router.post('/getReserves',async(req,res)=>{
    if (!req.body.tokenA || !req.body.tokenB) res.send({"code": 3000, "msg":"参数错误", "data": {}})
    let r=  await actionService.getReserves(req.body.tokenA, req.body.tokenB)
    let rst = {
        "code": 200,
        "msg":"成功",
        "data": {
            "reserveA":r.reserveA,
            "reserveB":r.reserveB
        }
    }
    res.send(rst)
});
router.post('/getReservesETH',async(req,res)=>{
    if (!req.body.token) res.send({"code": 3000, "msg":"参数错误", "data": {}})
    let r=  await actionService.getReservesETH(req.body.token)
    let rst = {
        "code": 200,
        "msg":"成功",
        "data": {
            "reserveA":r.reserveA,
            "reserveB":r.reserveB
        }
    }
    res.send(rst)
});

router.post('/quote',async(req,res)=>{
    if(!req.body.amountADesired || !req.body.reserveA || !req.body.reserveB) res.send({"code": 3000, "msg":"参数错误", "data": {}})
    let b =  await actionService.quote(req.body.amountADesired, req.body.reserveA, req.body.reserveB)
    let rst = {
        "code": 200,
        "msg":"成功",
        "data": {
            "b":b
        }
    }
    res.send(rst)
});

router.post('/factory',async(req,res)=>{
    let addr =  await actionService.factory()
    let rst = {
        "code": 200,
        "msg":"成功",
        "data": {
            "address":addr
        }
    }
    res.send(rst)
});

router.post('/WETH',async(req,res)=>{
    let addr =  await actionService.WETH()
    let rst = {
        "code": 200,
        "msg":"成功",
        "data": {
            "address":addr
        }
    }
    res.send(rst)
});

router.post('/getAmountsIn',async(req,res)=>{
    if(!req.body.amountOut || !req.body.path) res.send({"code": 3000, "msg":"参数错误", "data": {}})
    let as =  await actionService.getAmountsIn(req.body.amountOut, req.body.path)
    let rst = {
        "code": 200,
        "msg":"成功",
        "data": {
            "amounts":as
        }
    }
    res.send(rst)
});

router.post('/getAmountsOut',async(req,res)=>{
    if(!req.body.amountIn || !req.body.path) res.send({"code": 3000, "msg":"参数错误", "data": {}})
    let as =  await actionService.getAmountsOut(req.body.amountIn, req.body.path)
    let rst = {
        "code": 200,
        "msg":"成功",
        "data": {
            "amounts":as
        }
    }
    res.send(rst)
});

//pair
router.post('/getTotalLiquidity',async(req,res)=>{
    if(!req.body.pair) res.send({"code": 3000, "msg":"参数错误", "data": {}})
    let total =  await actionService.getTotalLiquidity(req.body.pair)
    let rst = {
        "code": 200,
        "msg":"成功",
        "data": {
            "total":total
        }
    }
    res.send(total)
});

router.post('/getPersonalLiquidity',async(req,res)=>{
    if(!req.body.pair || !req.body.owner) res.send({"code": 3000, "msg":"参数错误", "data": {}})
    let personal =  await actionService.getPersonalLiquidity(req.body.pair,req.body.owner)
    let rst = {
        "code": 200,
        "msg":"成功",
        "data": {
            "personal":personal
        }
    }
    res.send(rst)
});

router.post('/addLiquidity',async(req,res)=>{
    if(!req.body.tokenA || !req.body.tokenB || !req.body.amountADesired || !req.body.amountBDesired ||
        !req.body.amountAMin || !req.body.amountBMin || !req.body.to || !req.body.timeout || !req.body.userID) res.send({"code": 3000, "msg":"参数错误", "data": {}})

    let privateKey = await actionService.getPrivateKeyByUserID(req.body.userID)
    await actionService.approveTokenForTokens(req.body.tokenA,req.body.amountADesired,privateKey)
    await actionService.approveTokenForTokens(req.body.tokenB,req.body.amountBDesired,privateKey)

    let tx = await actionService.addLiquidity(req.body.tokenA,req.body.tokenB,req.body.amountADesired,req.body.amountBDesired,
        req.body.amountAMin,req.body.amountBMin,req.body.to,req.body.timeout,privateKey)

    if (tx.status) res.send({"code": 200, "msg":"成功", "data": {"tx":tx}})
    else res.send({"code": 4000, "msg":"失败", "data": {"tx":tx}})
});
router.post('/addLiquidityETH',async(req,res)=>{
    if(!req.body.token || !req.body.amountTokenDesired || !req.body.amountETHDesired ||
        !req.body.amountTokenMin || !req.body.amountETHMin || !req.body.to || !req.body.timeout || !req.body.userID) res.send({"code": 3000, "msg":"参数错误", "data": {}})

    let privateKey = await actionService.getPrivateKeyByUserID(req.body.userID)
    await actionService.approveTokenForTokens(req.body.token,req.body.amountTokenDesired,privateKey)

    let tx = await actionService.addLiquidityETH(req.body.token,req.body.amountTokenDesired,req.body.amountETHDesired,
        req.body.amountTokenMin,req.body.amountETHMin,req.body.to,req.body.timeout,privateKey)

    if (tx.status) res.send({"code": 200, "msg":"成功", "data": {"tx":tx}})
    else res.send({"code": 4000, "msg":"失败", "data": {"tx":tx}})
});

router.post('/swapExactTokensForTokens',async(req,res)=>{
    if(!req.body.amountIn || !req.body.amountOutMin || !req.body.path || !req.body.to || !req.body.timeout || !req.body.userID) res.send({"code": 3000, "msg":"参数错误", "data": {}})

    let privateKey = await actionService.getPrivateKeyByUserID(req.body.userID)
    await actionService.approveTokenForTokens(req.body.path[0],req.body.amountIn,privateKey)

    let tx = await actionService.swapExactTokensForTokens(req.body.amountIn,req.body.amountOutMin,req.body.path,req.body.to,req.body.timeout,privateKey)

    if (tx.status) res.send({"code": 200, "msg":"成功", "data": {"tx":tx}})
    else res.send({"code": 4000, "msg":"失败", "data": {"tx":tx}})
});
router.post('/swapTokensForExactTokens',async(req,res)=>{
    if(!req.body.amountOut || !req.body.amountInMax || !req.body.path || !req.body.to || !req.body.timeout || !req.body.userID) res.send({"code": 3000, "msg":"参数错误", "data": {}})

    let privateKey = await actionService.getPrivateKeyByUserID(req.body.userID)
    await actionService.approveTokenForTokens(req.body.path[0],req.body.amountInMax,privateKey)

    let tx = await actionService.swapTokensForExactTokens(req.body.amountOut,req.body.amountInMax,req.body.path,req.body.to,req.body.timeout,privateKey)

    if (tx.status) res.send({"code": 200, "msg":"成功", "data": {"tx":tx}})
    else res.send({"code": 4000, "msg":"失败", "data": {"tx":tx}})
});

router.post('/swapTokensForExactETH',async(req,res)=>{
    if(!req.body.amountOut || !req.body.amountInMax || !req.body.path || !req.body.to || !req.body.timeout || !req.body.userID) res.send({"code": 3000, "msg":"参数错误", "data": {}})

    let privateKey = await actionService.getPrivateKeyByUserID(req.body.userID)
    await actionService.approveTokenForTokens(req.body.path[0],req.body.amountInMax,privateKey)

    let tx = await actionService.swapTokensForExactETH(req.body.amountOut,req.body.amountInMax,req.body.path,req.body.to,req.body.timeout,privateKey)

    if (tx.status) res.send({"code": 200, "msg":"成功", "data": {"tx":tx}})
    else res.send({"code": 4000, "msg":"失败", "data": {"tx":tx}})
});
router.post('/swapExactTokensForETH',async(req,res)=>{
    if(!req.body.amountIn || !req.body.amountOutMin || !req.body.path || !req.body.to || !req.body.timeout || !req.body.userID) res.send({"code": 3000, "msg":"参数错误", "data": {}})

    let privateKey = await actionService.getPrivateKeyByUserID(req.body.userID)
    await actionService.approveTokenForTokens(req.body.token,req.body.amountIn,privateKey)

    let tx = await actionService.swapExactTokensForETH(req.body.amountIn,req.body.amountOutMin,req.body.path,req.body.to,req.body.timeout,privateKey)

    if (tx.status) res.send({"code": 200, "msg":"成功", "data": {"tx":tx}})
    else res.send({"code": 4000, "msg":"失败", "data": {"tx":tx}})
});

router.post('/swapExactETHForTokens',async(req,res)=>{
    if(!req.body.amountIn || !req.body.amountOutMin || !req.body.path || !req.body.to || !req.body.timeout || !req.body.userID) res.send({"code": 3000, "msg":"参数错误", "data": {}})

    let privateKey = await actionService.getPrivateKeyByUserID(req.body.userID)
    let tx = await actionService.swapExactETHForTokens(req.body.amountIn,req.body.amountOutMin,req.body.path,req.body.to,req.body.timeout,privateKey)

    if (tx.status) res.send({"code": 200, "msg":"成功", "data": {"tx":tx}})
    else res.send({"code": 4000, "msg":"失败", "data": {"tx":tx}})
});
router.post('/swapETHForExactTokens',async(req,res)=>{
    if(!req.body.amountIn || !req.body.amountOut || !req.body.path || !req.body.to || !req.body.timeout || !req.body.userID) res.send({"code": 3000, "msg":"参数错误", "data": {}})

    let privateKey = await actionService.getPrivateKeyByUserID(req.body.userID)
    let tx = await actionService.swapETHForExactTokens(req.body.amountIn,req.body.amountOut,req.body.path,req.body.to,req.body.timeout,privateKey)

    if (tx.status) res.send({"code": 200, "msg":"成功", "data": {"tx":tx}})
    else res.send({"code": 4000, "msg":"失败", "data": {"tx":tx}})
});

router.post('/removeLiquidity',async(req,res)=>{
    if(!req.body.tokenA || !req.body.tokenB || !req.body.liquidity ||
        !req.body.amountAMin || !req.body.amountBMin || !req.body.to || !req.body.timeout || !req.body.userID) res.send({"code": 3000, "msg":"参数错误", "data": {}})

    var pairAddr = await actionService.getPairAddress(req.body.tokenA, req.body.tokenB);
    console.log("pairAddr: "+pairAddr.toString());

    let privateKey = await actionService.getPrivateKeyByUserID(req.body.userID)
    await actionService.approvePair(pairAddr, req.body.liquidity , privateKey);
    let tx = await actionService.removeLiquidity(req.body.tokenA,req.body.tokenB,req.body.liquidity,
        req.body.amountAMin,req.body.amountBMin,req.body.to,req.body.timeout,privateKey);

    if (tx.status) res.send({"code": 200, "msg":"成功", "data": {"tx":tx}})
    else res.send({"code": 4000, "msg":"失败", "data": {"tx":tx}})
});
router.post('/removeLiquidityETH',async(req,res)=>{
    if(!req.body.token || !req.body.liquidity ||
        !req.body.amountTokenMin || !req.body.amountETHMin || !req.body.to || !req.body.timeout || !req.body.userID) res.send({"code": 3000, "msg":"参数错误", "data": {}})

    let privateKey = await actionService.getPrivateKeyByUserID(req.body.userID)
    let pair = await actionService.getPairAddressETH(req.body.token);
    console.log(pair)
    await actionService.approvePair(pair,req.body.liquidity,privateKey)
    let tx = await actionService.removeLiquidityETH(req.body.token,req.body.liquidity,
        req.body.amountTokenMin,req.body.amountETHMin,req.body.to,req.body.timeout,privateKey)

    if (tx.status) res.send({"code": 200, "msg":"成功", "data": {"tx":tx}})
    else res.send({"code": 4000, "msg":"失败", "data": {"tx":tx}})
});

module.exports = router;