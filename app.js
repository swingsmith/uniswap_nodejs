
require('express-async-errors');

let express = require('express');

let bodyParser = require('body-parser');

let morgan = require('morgan');

let config = require('./config');

let app = express();


app.all('*',function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});


//注册日志中间件
app.use(morgan('combined'));

//注册body-preser中间件
app.use(bodyParser.json());

//注册自定义中间件
app.use(require('./middleware/res_md'));
//注册路由
app.use("/contract", require('./router/router'));



// app.use("/category",require('./router/category'));
// app.use("/product",require('./router/product'));
// app.use("/order", require('./router/order'));

//异常处理中间件
app.use((err, req, res, next) => {
    res.fail(err.toString());
});

app.listen(8888,()=>{
    console.log('启动成功');
})