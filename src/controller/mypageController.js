const { response, errResponse } = require('../library/response');
const returnCode = require('../library/returnCode');
const { verify } = require('../library/jwt');

const mypageService = require('../service/mypageService');

/* 내 정보 조회
    user = userIdx, user_id, user_name, user_access_dt
    1. req.headers.authorizaition 가 없을 경우
*/
async function getMypageInfo(req, res) {  // 내정보 조회
    try{
        // 1. req.headers.authorizaition 가 없을 경우
        if(req.headers.authorization == null){
            errResponse(res, returnCode.BAD_REQUEST, '토큰 값이 요청되지 않았습니다');
        }

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
        response(res,returnCode.OK, '유저정보 조회 성공', userInfo);
        
    
    }catch(error){
        console.log(error.message);
        errResponse(res,returnCode.INTERNAL_SERVER_ERROR ,"서버 오류");
    }
}


/* 처방전 리스트 조회
    prescriptionIdx, prescription_dt
    -   Error   -
    1. 처방전이 없을 경우

    -   주의  -
    2. 조회는 성공했으나 개수가 0개인 경우
*/
async function getMypagePrescription(req, res) {  // 처방전목록조회(최신순)
    try{
        // 토큰
        if(req.headers.authorization == null){
            errResponse(res, returnCode.BAD_REQUEST, '토큰 값이 요청되지 않았습니다');
        }
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
        if(prescription == -2){
            errResponse(res, returnCode.BAD_REQUEST, "등록된 처방전이 없습니다");
        }
        // 2. 조회는 성공했으나 개수가 0개인 경우
        else if(prescription == -3){
            response(res,returnCode.OK, '처방전리스트 조회 성공(0개)');
        }
        else{
            response(res,returnCode.OK, '처방전리스트 조회 성공(n개)', prescription);
        }

    }catch(error){
        console.log(error);
        errResponse(res, returnCode.DB_ERROR, "처방전 목록이 없습니다")
    }
}

/* 1개의 처방전 약품 조회
    req: prescriptionIdx
    userIdx, prescriptionIdx, preMedicineIdx, pre_medicine_name, total_does_dt, my_does_dt, total_does_count
    -   Error   -
    1. 요청이 없을 경우 (처방전이 없을 경우)
    2. 해당하는 처방전이 없는 경우
*/
async function getONEPriscription(req, res) {  // 1개의처방전약품조회(가나다)
    try{
        // 토큰
        if(req.headers.authorization == null){
            errResponse(res, returnCode.BAD_REQUEST, '토큰 값이 요청되지 않았습니다');
        }
        const token = req.headers.authorization;
        const decoded = verify(token);
        const userIdx = decoded.userIdx;

        // 토큰 확인
        if(decoded == -3){
            errResponse(res,returnCode.UNAUTHORIZED, "만료된 토큰입니다");
        }else if(decoded == -2){
            errResponse(res,returnCode.UNAUTHORIZED, "invalid token");
        }

        const onePrescription = await mypageService.getONEPrescriptionService(userIdx, req.query.prescriptionIdx);
        
        if(onePrescription == -1){               // 1. 요청이 존재하지 않을 경우
            errResponse(res,returnCode.BAD_REQUEST, "처방전이 요청되지 않았습니다");
        }else if(onePrescription == -2){        // 2. 해당하는 처방전이 없는 경우
            errResponse(res,returnCode.BAD_REQUEST, "해당하는 처방전이 없습니다");
        } else{
            response(res,returnCode.OK, '해당 처방전 조회 성공', onePrescription);
        }
        
    }catch(error){
        console.log(error);
        errResponse(res, returnCode.DB_ERROR, "해당 처방전을 불러오지 못했습니다")
    }
}


module.exports = { 
    getMypageInfo,
    getMypagePrescription,
    getONEPriscription
}
