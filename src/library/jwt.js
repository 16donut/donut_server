const randToken = require('rand-token');
const jwt = require('jsonwebtoken');
const { secretConfig } = require("../../config/secretConfig.js");
const { errResponse } = require("../library/response");
const returnCode = require("../library/returnCode");

function sign(userIdx) { 
    const payload = {
    userIdx: userIdx
    }
    const result = { // sign 메소드를 이용해 access 토큰 발급
        "token" : jwt.sign(payload, secretConfig.secretKey, secretConfig.option) // secretKey모듈의 시크릿키, 옵션 가져옴
    } 
    return result;
}

function verify(authorization) { // verify를 통해 토큰 값을 decode 한다.
    try {
       return jwt.verify(authorization, secretConfig.secretKey); // return userIdx
    } catch (err) {
        if (err.message === 'jwt expired') {
            console.log('expired token');
            return -3;
        } else if (err.message === 'invalid token') {
            console.log('invalid token');
            return -2;
        } else {
            console.log("invalid token");
            return -2;
        }
    }
}

function isLogin(req, res, next) {
    const { authorization } = req.headers;

    if (!authorization) { // 토큰이 없는 경우
        req.user = {
            userIdx: null
        };
    } else { // 토큰이 있는 경우
        try {  // 유효한 경우 token을 decode
        req.user = jwt.verify(authorization, secretConfig.secretKey);
        next();

        } catch (error) { // 유효하지 않은 경우
        errResponse(res, returnCode.UNAUTHORIZED, error.message); // 
        }
    }
}

function checkLogin(req, res, next) {
    const { authorization } = req.headers;

    try { // 유효한 경우 token decode
        req.user = jwt.verify(authorization, secretConfig.secretKey);
        next();

    } catch (error) { // 유효하지 않은 경우 
        errResponse(res, returnCode.UNAUTHORIZED, error.message);
    }
}

module.exports = {
    sign,
    verify,
    isLogin,
    checkLogin
};