
let config = null;

if (process.env.Node_ENV === 'production'){
    config = require('./prod')
}else{
    config = require('./dev')
}

module.exports = config;

