const { response, errResponse } = require('../library/response');
const returnCode = require('../library/returnCode');
const { verify } = require('../library/jwt');

const authService = require('../service/authService');

/* 회원가입 
user = userIdx, user_id, user_pwd, user_name, user_salt, user_access_dt
1. 요청 데이터가 부족할 경우
2. 아이디가 중복일 경우
3. DB에 데이터가 입력되지 않았을 경우
*/ 

async function postAuthSignup(req, res) {  
    try {
        const userData = await authService.postAuthSignup(req.body);

        if(userData == -1){ // 요청 바디가 부족할 경우
            response(res, returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
        }
        else if(userData == -2) { // user_id가 중복일 경우
            response(res, returnCode.CONFLICT, "중복된 아이디가 존재합니다");
        }
        // else if(userData == -3) { // 쿼리문이 제대로 수행되지 않았을 경우
        //     response(res, returnCode.BAD_REQUEST, "DB에 데이터가 입력되지 않았습니다");
        // }
        else{
            response(res, returnCode.CREATED, "회원가입 성공");
        }
    } catch (error) {
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}

/* 로그인
user = userIdx, user_id, user_pwd, user_name, user_salt, user_access_dt
1. 요청 데이터가 부족할 경우 -1
2. 아이디가 중복일 경우 -2
3. 비밀번호가 중복일 경우 -3
*/ 

async function postAuthSignin(req, res) {  
    try {
        const userData = await authService.postAuthSignin(req.body); // 토큰 값

        if(userData == -1){ // 요청 바디가 부족할 경우
            response(res, returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
        }
        else if(userData == -2) { // user_id가 DB에 없을 경우
            response(res, returnCode.BAD_REQUEST, "아이디가 존재하지 않습니다");
        }
        else if(userData == -3) { // user_pwd가 틀렸을 경우
            response(res, returnCode.UNAUTHORIZED, "비밀번호가 틀렸습니다");
        }
        else if(userData == -4) { // 쿼리문이 제대로 수행되지 않았을 경우 = 마지막 로그인 시간 갱신이 되지 않았을 경우
            response(res, returnCode.BAD_REQUEST, "DB에 데이터가 입력되지 않았습니다");
        }
        else {
            response(res, returnCode.CREATED, "로그인 성공", userData);
        }
    } catch (error) {
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}

/* 유저의 토큰 값 확인
1. Idx로 조회
2. Id로 조회
*/
async function getAuthToken(req, res) {   
    try {
        const requestData = req.body;

        if(requestData[0].userIdx){ // Idx로 조회
            response(res, returnCode.OK, "토큰 조회 성공", token);
        }
        else if(requestData[0].userId){ // Id로 조회
            response(res, returnCode.OK, "토큰 조회 성공", token);
        }
    } catch (error) {
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}

async function getAuthTokenToIdx(req, res) {   
    try {
        const token = req.headers.authorization;
        const decoded = verify(token);
        const userIdx = decoded.userIdx;
        response(res, returnCode.OK, "userIdx 조회 성공");

    } catch (error) {
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}


module.exports = {
    postAuthSignin,
    postAuthSignup,
    getAuthToken,
    getAuthTokenToIdx
}