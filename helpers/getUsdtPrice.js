let getUsdtPriceUrl = `http://www.roadpro.ltd/market/exchange-rate/usd-cny`

let getUsdtPrice = async() => {
    let res = await axios.get(getUsdtPriceUrl);
    return res.data.data
}

module.exports = getUsdtPrice