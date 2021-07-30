const mysql = require('mysql');

let getSuperConnection = connection => {
    connection.run = function(sql, params) {
        return new Promise((resolve, reject) => {
            this.query(sql, params, (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

    connection.findOne = function(sql, params) {
        return new Promise((resolve, reject) => this.run(sql, params).then(list => resolve(list[0])).catch(e => reject(e)))
    }
    connection.count = function(sql, params) {
        return new Promise((resolve, reject) => this.run(sql, params).then(list => resolve(list[0]['count(*)'])).catch(e => reject(e)))
    }
    connection.find = connection.run;
    connection.create = connection.run
    connection.modify = connection.run
    connection.remove = connection.run
    return connection
}


class DB {
    constructor(config) {
        this.pool = mysql.createPool(config);
    }
    query(sql, params) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    reject(err)
                } else {
                    connection.query(sql, params, (err, rows) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(rows)
                        }
                        connection.release()
                    })
                }
            })
        })
    }
    find(sql, params) {
        return new Promise((resolve, reject) => this.query(sql, params).then(list => resolve(list)).catch(e => reject(e)))
    }
    findOne(sql, params) {
        return new Promise((resolve, reject) => this.query(sql, params).then(list => resolve(list[0])).catch(e => reject(e)))
    }
    count(sql, params) {
        return new Promise((resolve, reject) => this.query(sql, params).then(list => resolve(list[0]['count(*)'])).catch(e => reject(e)))
    }
    create(sql, params) {
        return new Promise((resolve, reject) => this.query(sql, params).then(list => resolve(list)).catch(e => reject(e)))
    }
    remove(sql, params) {
        return new Promise((resolve, reject) => this.query(sql, params).then(list => resolve(list)).catch(e => reject(e)))
    }
    modify(sql, params) {
        return new Promise((resolve, reject) => this.query(sql, params).then(list => resolve(list)).catch(e => reject(e)))
    }
    beginTransaction() {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    reject(err)
                } else {
                    connection.beginTransaction(error => {
                        if (error) {
                            reject(error)
                        } else {
                            connection = getSuperConnection(connection)
                            resolve(connection);
                        }
                    })
                }
            })
        })
    }
}

module.exports = DB