const { response, errResponse } = require('../library/response');
const returnCode = require('../library/returnCode');
const { verify } = require('../library/jwt');

const mainService = require('../service/mainService');

async function getMainExpire(req, res) {  // 버릴약목록전체조회(최신순)
}

/* 해당 일별 복용 체크 조회
idx : {
    복용일 : ""
    약이름 : "",
    하루복용횟수: ""
}
*/
async function getMainCheck(req, res) {  
    try {
        const token = req.headers.authorization;
        
        if(token == null){
            response(res, returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
        }
        else {
            const decoded = verify(token); // 토큰 확인용
            
            if(decoded == -2){ // 유효하지 않은 토큰
                errResponse(res, returnCode.UNAUTHORIZED, 'invalid token'); 
            }      

            else if(decoded == -2){ // 만료된 토큰
                errResponse(res, returnCode.UNAUTHORIZED, 'expired token'); 
            }
                const userIdx = decoded.userIdx;
                const todayResult = await mainService.getMainDoesCheck(userIdx);

            if(todayResult == -4) { // 쿼리문이 제대로 수행되지 않았을 경우
                response(res, returnCode.BAD_REQUEST, "DB에 데이터가 입력되지 않았습니다");
            }
            else {
                response(res, returnCode.CREATED, "일별 복용 조회 성공", todayResult);
            }
        }
    } catch (error) {
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}

/* 일별 복용 체크 
1. 복용 체크 1 update
2. 내가 복용한 일수 -1 
*/
async function putMainDoesCheck(req, res) {  
    try {
        const token = req.headers.authorization;
        
        if(token == null){
            response(res, returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
        }
        else {
            const decoded = verify(token); // 토큰 확인용
            
            if(decoded == -2){ // 유효하지 않은 토큰
                errResponse(res, returnCode.UNAUTHORIZED, 'invalid token'); 
            }      

            else if(decoded == -2){ // 만료된 토큰
                errResponse(res, returnCode.UNAUTHORIZED, 'expired token'); 
            }
                const checkResult = await mainService.putMainDoesCheck(req.body);

            if(checkResult == -1){ // 요청 바디가 부족할 경우
                response(res, returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
            }

            else if(checkResult == -2){ // 내 복용일이 총 복용일 보다 높을 경우
                response(res, returnCode.BAD_REQUEST, "일별 복용 체크 불가능");
            }

            else if(checkResult == -4) { // 쿼리문이 제대로 수행되지 않았을 경우
                response(res, returnCode.BAD_REQUEST, "DB에 데이터가 입력되지 않았습니다");
            }
            else {
                response(res, returnCode.CREATED, "일별 복용 체크 성공");
            }
        }
    } catch (error) {
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}

/* 일별 복용 체크 취소
1. 복용 체크 0 update
2. 내가 복용한 일수 +1
*/
async function putMainDoesCheckCancel(req, res) { 
    try {
        const token = req.headers.authorization;
        
        if(token == null){
            response(res, returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
        }
        else {
            const decoded = verify(token); // 토큰 확인용
            
            if(decoded == -2){ // 유효하지 않은 토큰
                errResponse(res, returnCode.UNAUTHORIZED, 'invalid token'); 
            }      

            else if(decoded == -2){ // 만료된 토큰
                errResponse(res, returnCode.UNAUTHORIZED, 'expired token'); 
            }
                const prescriptData = await mainService.putMainDoesCheckCancel(req.body);

            if(prescriptData == -1){ // 요청 바디가 부족할 경우
                response(res, returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
            }
            else if(prescriptData == -2){ // 내 복용일이 0보다 작을 경우
                response(res, returnCode.BAD_REQUEST, "일별 복용 체크 취소 불가능");
            }
            else if(prescriptData == -4) { // 쿼리문이 제대로 수행되지 않았을 경우
                response(res, returnCode.BAD_REQUEST, "DB에 데이터가 입력되지 않았습니다");
            }
            else {
                response(res, returnCode.CREATED, "일별 복용 체크 취소 성공");
            }
        }
    } catch (error) {
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}

async function postMainQrcode(req, res) {  // QR코드처방전등록
}


/* 처방 약 등록 + 처방전 등록
req.params = token
req.body = pre_medicine_name(약이름), total_does_dt(총복용일)
처방전 = prescriptionIdx, userIdx(token),
prescription_dt
처방약 = preMedicineIdx, prescriptionIdx, 
pre_medicine_name, total_does_dt, my_does_dt(default), total_does_count(하루 복용 횟수)
 */
async function postMainPrescription(req, res) { 
    try {
        const token = req.headers.authorization;
        
        if(token== null){
            response(res, returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
        }
        else {
            const decoded = verify(token); // 토큰 확인용
            
            if(decoded == -2){ // 유효하지 않은 토큰
                errResponse(res, returnCode.UNAUTHORIZED, 'invalid token'); 
            }      

            else if(decoded == -2){ // 만료된 토큰
                errResponse(res, returnCode.UNAUTHORIZED, 'expired token'); 
            }
                const userIdx = decoded.userIdx;
                const prescriptData = await mainService.postMainPrescription(userIdx, req.body);

            if(prescriptData == -1){ // 요청 바디가 부족할 경우
                response(res, returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
            }

            else if(prescriptData == -4) { // 쿼리문이 제대로 수행되지 않았을 경우
                response(res, returnCode.BAD_REQUEST, "DB에 데이터가 입력되지 않았습니다");
            }
            else {
                response(res, returnCode.CREATED, "처방전 등록 성공");
            }
        }
    } catch (error) {
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}

module.exports = {
    getMainExpire,
    getMainCheck,
    putMainDoesCheck,
    putMainDoesCheckCancel,
    postMainQrcode,
    postMainPrescription
}
