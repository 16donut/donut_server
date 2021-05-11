const authDao = require('../dao/authDao');

const crypto = require('crypto-promise');
const moment = require('moment');

const jwt = require("../library/jwt");

/* 회원가입 
user = userIdx, user_id, user_pwd, user_name, user_salt, user_access_dt
1. 요청 데이터가 부족할 경우
2. 아이디가 중복일 경우
*/ 
async function postAuthSignup(body) {
    const user_id = body.user_id;
    const user_pwd = body.user_pwd;
    const user_name = body.user_name;

    if(!user_id || !user_pwd || !user_name){ // 요청 바디가 부족할 경우
        return -1;
    }
    const existUserId = await authDao.selectUserId(user_id);
    if(existUserId.length > 0) { // user_id가 중복일 경우
        return -2;
    }
    //const rand = crypto.randomByte(64); // 랜덤 값 
    //const salt = rand.toString('base64'); // 솔트 값
    const salt = (await crypto.randomBytes(32)).toString('base64');

    // 해시 비밀번호
    const hashedPwd = await crypto.pbkdf2(user_pwd.toString(), salt, 1000, 32, 'SHA512');
    
    let user_access_dt = moment().format('YYYY-MM-DD'); // 가입 시간 

    let allUserData = {
        "user_id" : user_id,
        "user_pwd" : hashedPwd.toString('base64'),
        "user_name" : user_name,
        "user_salt" : salt,
        "user_access_dt" : user_access_dt
    } 

    const insertUserIdResult = await authDao.insertUserSignup(allUserData);

    // if(!insertUserIdResult){ // 쿼리문이 제대로 수행되지 않았을 경우
    //     return -3;
    // }

    return 0;
}

/* 로그인
user = userIdx, user_id, user_pwd, user_name, user_salt, user_access_dt
1. 요청 데이터가 부족할 경우
2. 아이디가 존재하지 않을 경우
3. 비밀번호가 틀렸을 경우
*/ 
async function postAuthSignin(body) {
    const user_id = body.user_id;
    const user_Enter_pwd = body.user_pwd; // 입력한 패스워드

    if(!user_id || !user_Enter_pwd){ // 요청 바디가 부족할 경우
        return -1;
    }
    
    const userInfo = await authDao.selectUserInfo(user_id);

    if(userInfo.length == 0) { // user_id가 존재하지 않을 경우
        return -2;
    }

    // user_salt 값을 디비에서 가져온 후 
    // 입력한 비밀번호를 salt 값으로 해시한다.
    const salt = userInfo[0].user_salt;
    const hashedEnterPwd = await crypto.pbkdf2(user_Enter_pwd.toString(), salt, 1000, 32, 'SHA512');

    // db에서 가져온 user_pwd 값과 입력한 user_pwd와 비교
    const dbPwd = userInfo[0].user_pwd;

    if(dbPwd != hashedEnterPwd.toString('base64')){ // 비밀번호가 틀릴 경우 
        return -3;
    }
    const token = jwt.sign(userInfo[0].userIdx); // sign 메소드를 이용해 access 토큰 발급

    let user_access_dt = moment().format('YYYY-MM-DD'); // 현재 시간 조회

    let resetData = {
        "user_id": user_id,
        "user_access_dt": user_access_dt
    }

    const resetAccessResult = await authDao.updateUserAccess(resetData); // 마지막 로그인 시간 갱신

    if(!resetAccessResult){ // DB에 갱신하지 못했을 경우
        return -4;
    }

    return token;
}

module.exports = {
    postAuthSignup,
    postAuthSignin
}