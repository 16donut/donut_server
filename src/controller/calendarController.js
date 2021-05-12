const { response, errResponse } = require('../library/response');
const returnCode = require('../library/returnCode');
const { verify } = require('../library/jwt');

const calendarService = require('../service/calendarService');

async function getCalendarEat(req, res) {  // 먹은 약 조회

    try{
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

        var eatSelectData = await calendarService.selectEatMedcineService(userIdx);


        if(eatSelectData == -1){
            response(res, returnCode.NO_CONTENT, "검색된 약이 없습니다");
        }else{
            response(res,returnCode.OK, '먹은 약 검색 성공', eatSelectData);
        }
    } catch (error) {
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}
async function getCalendarNoEat(req, res) {  // 안먹은 약 조회

    try{
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

        var donEatSelectData = await calendarService.selectDontEatMedecineService(userIdx);

        if(donEatSelectData == -1){
            response(res, returnCode.OK, "검색된 약이 없습니다.");
        }else{
            response(res,returnCode.OK, '안먹은 약 검색 성공', donEatSelectData);
        }
    }catch (error) {
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}
async function getCalendarExpire(req, res) {  // 버릴 약 조회

    try{
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

        var abandonSelectData = await calendarService.selectAbondonMedecine(userIdx);

        if(abandonSelectData == -1){
            response(res, returnCode.NO_CONTENT, "검색된 약이 없습니다");
        }else{
            response(res,returnCode.OK, '버릴 약 검색 성공', abandonSelectData);
        }
        } catch (error) {
            console.log(error.message);
            errResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
        }
}

module.exports = {
    getCalendarEat,
    getCalendarNoEat,
    getCalendarExpire
}
