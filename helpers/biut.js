const SECUtil = require("@biut-block/biutjs-util");
let fetch = require("node-fetch");
let httpHeaderOption = {
    "content-type": "application/json",
};

let baseUrl = "http://47.93.136.:3003";
//require('../helpers')
let { biutCenterAddress } = cfg

let access = async (method, params) => {
    try {
        let Data = {
            jsonrpc: "2.0",
            id: "1",
            method: method,
            params: params,
        };
        let res = await fetch(baseUrl, {
            method: "post",
            body: JSON.stringify(Data),
            headers: httpHeaderOption,
        })
        let result = await res.json();
        return result.result
    } catch (err) {
        console.log(err)
        throw err
    }
}

let getTransactions = async address => {
    try {
        return await access("sec_getTransactions", [address])
    } catch (err) {
        console.log(err)
        throw err
    }
}

let getTransactionsByBlock = async (address, blockHeight) => {
    try {
        return (await access("sec_getTransactionsByBlock", [address, blockHeight])).resultInChain
    } catch (err) {
        console.log(err)
        throw err
    }
}

let getTransactionByHash = async (hash) => await access('sec_getTransactionByHash', [hash])

let getLastBlock = async () => {
    try {
        return (await access("sec_getLastBlock", [])).blockInfo[0].Number
    } catch (err) {
        console.log(err)
        throw err
    }
}

let run = async () => {
    // let b = await getLastBlock()
    // console.log(b)
    // let t1 = await getTransactions('435738239aabb628a6193c75905bac31e5468d96')
    // console.log(t1)

    let errNum = 0;
    for (let i = 128486; i < 128648; i++) {
        let connection = await db.beginTransaction();
        let vipConnection = await vipCoinDb.beginTransaction();
        try {
            console.log('BIU: ' + i + "/" + 128648, `共计检查异常${errNum}个`)
            let result = await getTransactionsByBlock(biutCenterAddress, i)
            for (let item of result) {
                if (item.TxReceiptStatus != 'success' ||
                    item.TxTo != biutCenterAddress ||
                    !item.TxFrom ||
                    //item.TokenName != 'SEN' ||
                    !item.Value

                ) {
                    continue
                }
                let user = await connection.findOne(`select * from tempUser where address = ?`, [item.TxFrom])
                if (!user) {
                    continue
                }
                let member_deposit = await vipConnection.findOne(`select id from member_deposit where txid = ?`, [item.TxHash])
                if (member_deposit) {
                    continue;
                }
                errNum = errNum + 1
                let amount = item.Value;
                let coin_id = 'BIU'
                let member = await vipConnection.findOne(`select id from member where username = ?`, [user.tel])
                let coin = await vipConnection.findOne(`select name,unit from coin where name = ?`, [coin_id])
                await vipConnection.create(`insert into member_deposit(address,amount,create_time,member_id,txid,unit) values(?)`, [
                    [
                        item.TxFrom, amount, new Date(item.TimeStamp), member.id, item.TxHash, coin.unit
                    ]
                ])
                await vipConnection.create(`insert into member_transaction(address,amount,create_time,discount_fee,
                                fee,flag,member_id,real_fee,symbol,type) values(?)`, [
                    [
                        item.TxFrom,
                        amount,
                        new Date(item.TimeStamp),
                        '0',
                        0,
                        0,
                        member.id,
                        '0',
                        coin.name,
                        0
                    ]
                ])
                await vipConnection.modify(`update  member_wallet set balance = balance + ?
                            where member_id = ? and coin_id = ?`, [amount, member.id, coin_id])
            }
            await connection.commit();
            await vipConnection.commit();
        } catch (err) {
            db.create(`insert into logs (oTime,des,err,type,status,errDetail) values (?)`, [
                [Date.now(), '同步BIU区块', err.message, 3, 500, JSON.stringify(err.stack)]
            ])
            await connection.rollback()
            await vipConnection.rollback()
            throw err;
        } finally {
            await connection.release();
            await vipConnection.release();
        }
    }
    console.log(`共计检查异常${errNum}个`)
    // let t2 = await getTransactionByHash('9dab6753ad358704dc98b8a44c353e7676744afdc0dcd9041df872324fd0f713')
    // console.log(t2)
}
//run()



module.exports = {
    getTransactions,
    getTransactionsByBlock,
    getLastBlock
}
