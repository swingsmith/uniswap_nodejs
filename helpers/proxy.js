let request = require("request");
//let baseUrl = `http://www.roadpro.ltd`
let baseUrl = `http://exchange.stones.gam`

let access = async (params, url, headers) => {
    return new Promise((resolve, reject) => {
        let options = {
            method: 'POST',
            url: baseUrl + url,
            form: params
        };
        if (headers) {
            options.headers = headers;
        }
        request(options, function (error, response, body) {
            if (error) {
                reject(error)
            } else {
                if (typeof body == 'string') {
                    body = JSON.parse(body)
                }
                resolve(body)
            }
        });

    })
}

let getRegisterCode = async params => await access(params, '/uc/mobile/code')

let register = async params => {
    params = {
        code: '849215',
        username: params.phone,
        country: '中国',
        ticket: 't021f4buwpZDXRd4-eR8exOHu6l9LX7kZwGUZc0sXwNEz3iYpCxEDlaYTaOITuD9JGLdEq_RTHBvpeZLa2tDGsTz2yzjrBG7e-Ijshs8UnKuhFxawzsyiwQTA**',
        randStr: '@xet',
        promotion: '',
        superPartner: '',
        ...params
    }
    console.log(params)
    return await access(params, '/uc/register/phone')
}

let login = async params => await access(params, '/uc/login', { 'access-auth-token': params.authToken })

let getAssets = async params => await access({}, '/uc/asset/wallet', { 'access-auth-token': params.authToken })

module.exports = {
    getRegisterCode,
    register,
    login,
    getAssets
}