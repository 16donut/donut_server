const { response, errResponse } = require('../library/response');
const returnCode = require('../library/returnCode');
const { verify } = require('../library/jwt');

const calendarService = require('../service/calendarService');

async function getCalendarEat(req, res) {  // 이달의 먹은 약 조회
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

    var eatSelectData = await calendarService.selectEatMedcineService(userIdx);


    if(eatSelectData == -1){
        response(res, returnCode.NO_CONTENT, "검색된 약이 없습니다");
    }else{
        response(res,returnCode.OK, '먹은 약 검색에 성공했습니다.', eatSelectData);
    }
}
async function getCalendarNoEat(req, res) {  // 이달의 안먹은 약 조회
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

    var donEatSelectData = await calendarService.selectDontEatMedecineService(userIdx);

    if(donEatSelectData == -1){
        response(res, returnCode.NO_CONTENT, "검색된 약이 없습니다");
    }else{
        response(res,returnCode.OK, '안먹은 약 검색에 성공했습니다.', donEatSelectData);
    }

}
async function getCalendarExpire(req, res) {  // 이달의 버릴 약 조회
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
}

module.exports = {
    getCalendarEat,
    getCalendarNoEat,
    getCalendarExpire
}
