const { response, errResponse } = require('../library/response');
const returnCode = require('../library/returnCode');
const { verify } = require('../library/jwt');

const mypageService = require('../service/mypageService');

/* 내 정보 조회
    user = userIdx, user_id, user_name, user_access_dt
    1. 요청 바디가 존재하지 않을 경우
    2. 아이디가 존재하지 않을 경우
*/
async function getMypageInfo(req, res) {  // 내정보 조회
    try{
        // 토큰
        const token = req.headers.authorization;
        const decoded = verify(token);
        const userIdx = decoded.userIdx;

        // 토큰 확인
        if(decoded == -3){
            errResponse(res,returnCode.UNAUTHORIZED, "만료된 토큰입니다");
        }else if(decoded == -2){
            errResponse(res,returnCode.UNAUTHORIZED, "invalid token");
        }

        
        // mypageService 에서 받아온 유저정보
        const userInfo = await mypageService.getMypageInfoService(userIdx);
        
        // 1. 요청 바디가 없을 경우
        if(userInfo == -1){
            errResponse(res, returnCode.BAD_REQUEST, '요청된 데이터가 없습니다.');
        }
        // 2. 해당 유저 정보가 없을 경우
        else if(userInfo == -2){    
            response(res, returnCode.BAD_REQUEST, "등록된 유저 정보가 없습니다");
        }
        else{
            response(res,returnCode.OK, '유저정보 조회 성공', userInfo);
        }
    }catch(error){
        console.log(error.message);
        errResponse(res,returnCode.INTERNAL_SERVER_ERROR ,"서버 오류");
    }
}


/* 처방전 리스트 조회
    prescriptionIdx, prescription_dt
    -   Error   -
    1. 처방전이 없을 경우
*/
async function getMypagePrescription(req, res) {  // 처방전목록조회(최신순)
    try{
        // 토큰
        const token = req.headers.authorization;
        const decoded = verify(token);
        const userIdx = decoded.userIdx;

        // 토큰 확인
        if(decoded == -3){
            errResponse(res,returnCode.UNAUTHORIZED, "만료된 토큰입니다");
        }else if(decoded == -2){
            errResponse(res,returnCode.UNAUTHORIZED, "invalid token");
        }
        
        // 유저키를 이용하여 DAO에서 처리 후 객체 반환
        const prescription = await mypageService.getMypagePrescriptionService(userIdx);

        // 1. 처방전이 없을 경우
        if(prescription == -1){
            response(res, returnCode.BAD_REQUEST, "등록된 처방전이 없습니다");
        }else{
            response(res,returnCode.OK, '처방전리스트 조회 성공', prescription);
        }

    }catch(error){
        console.log(error);
        errResponse(res, returnCode.DB_ERROR, "처방전 목록이 없습니다")
    }
}
// async function postMypageMedicine(req, res) {  // 1개의처방전약품조회(가나다)
// }


module.exports = { 
    getMypageInfo,
    getMypagePrescription
    // postMypageMedicine
}
