const { response, errResponse } = require('../library/response');
const returnCode = require('../library/returnCode');
const { verify } = require('../library/jwt');

const returnService = require('../service/returnService');

/* 버릴약 목록 전체조회 (최신순)
    userIdx, prescriptionIdx, preMedicineIdx, pre_medicine_name, expireIdx, expire_dt, abandon_check
    
    -   주의   -
    1. 조회는 성공했으나 개수가 0개인 경우
*/
async function getReturnExpire(req, res) {  // 버릴약목록전체조회(최신순)
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
        const expireList = await returnService.getReturnExpireService(userIdx);

        // 1. 조회는 성공했으나 개수가 0개인 경우
        if(expireList == -3){
            response(res,returnCode.OK, '버릴 약 리스트 조회 성공(0개)');
        }
        else{
            response(res,returnCode.OK, '버릴 약 리스트 조회 성공(n개)', expireList);
        }

    }catch(error){
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}

async function deleteReturnExpire(req, res) {  // 버릴약목록삭제(회수완료)
}

async function insertAroundPharmacy(req, res){ // 내 위치 주변 약국 등록(2km)
    try{

        if(!req.body.longitude || !req.body.latitude){
            response(res, returnCode.BAD_REQUEST, 'not found body instance');
        }else{
            var check = await returnService.insertPharmacy(req.body);

            if(check == -1){
                response(res, returnCode.BAD_REQUEST, '우리나라가 아닙니다.');
            }
            if(check == 1){
            response(res, returnCode.OK, '약국 등록 완료');
            }
        }
        
    } catch (error) {
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}


async function getReturnPharmacy(req, res) {  // 약국조회(gps->가나다)

    try{

        var pharmacyData = await returnService.selectPharmacy(req);

        if(pharmacyData == -1){
            response(res, returnCode.BAD_REQUEST, 'param이 없습니다.')
        }else if(pharmacyData == -2){
            response(res, returnCode.BAD_REQUEST, '검색된 약국이 없습니다.');
        }else{
            response(res, returnCode.OK, '주변 약국 검색 성공', pharmacyData);
        }

    } catch (error) {
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}


module.exports = {
    getReturnExpire,
    deleteReturnExpire,
    getReturnPharmacy,
    insertAroundPharmacy
}
