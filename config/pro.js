
let Web3 = require('web3');
//let web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/25e722f188b141edbc18f6a3172e4b10"));
// let web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/62b266a75c1c4c839c97a9d12c8b6559"));
let web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.1.207:8888"));
//let web3 = new Web3("http://150.109.120.190:8545");

let mysql = {
    "host": 'mysql-bi',
    "port": 3306,
    "user": "game",
    "password": "rfven2iMZf6rBJBi",
    "database": "game",
    "charset": "UTF8_GENERAL_CI",
    "connectTimeout": 10000,
    "connectionLimit": 100,
};
let vipCoinMysql = {
    "host": '18.163.105.',
    "port": 3306,
    "user": "vipcoin",
    "password": "dfATUV6EmjxbzCoT",
    "database": "vipcoin",
    "charset": "UTF8_GENERAL_CI",
    "connectTimeout": 10000,
    "connectionLimit": 100,
}

let redis = {
    port: 6379,
    host: 'redis',
    family: 4,
    password: 'Hj,NUj.PLqC+O-PGjF',
    db: 0
};



module.exports = {
    web3,
    mysql,
    vipCoinMysql,
    redis,
    genesisGodSDAmount: 100000, //成为创世大神所需要的SD
    totalGenesisGod: 10, //成为创世大神总名额
    poolReleaseRate: 0.01, //矿池释放系数
    cashOutFee: {
        BIU: 0.05,
        USDT: 0.05,
        TIDE: 0.05,
        minCashOut: 100
    },
    teamIncomeTime: '30 2 4 * * *', //每天计算团队收益的时刻

    biutCenterAddress: 'ba6bb4e5bfdd37c43b1da4c664dfb54f730b6ddc',// '9c767305f35cfc925521246f2eaaca97f51d7a54',// 'ecf67827a7ebf30601b65a06f9b32b8ad5d149d3',

    usdtTokenid: '0xdac17f958d2ee523a2206206994597c13d831ec7', //7d是eth测试网like Coin合约地址  '0xC6c272a67292D0220baD4Cc2602A4c8D42f8E7ea',该地址是roadly测试地址  //USDT合约地址，
    tideTokenid: '0xd303cf6fdc49689cf42ddb44824d446664b76e95',
    chainId: "1",
    decimalDigit: 6, //USDT代币小数位数，18位测试代币roadly小数位数
    tideDecimalDigit: 18,
    ethCenterAddress: '0xBA6Bb4E5BFdd37c43B1dA4C664DFB54F730b6dDc', // '0x9C767305f35Cfc925521246f2Eaaca97f51D7a54'// '0x0278aBfDAECF3590744dCbcce0806ee6650CE499',
    tideCenterAddress: '0xBA6Bb4E5BFdd37c43B1dA4C664DFB54F730b6dDc'
}