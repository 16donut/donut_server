const { response, errResponse } = require('../library/response');
const returnCode = require('../library/returnCode');
const testService = require('../service/testService');

async function getTest(req, res) {  
    try {
        const test = await testService.getTest(req);

    /* 무슨 에러가 있을지 생각한 후에 에러처리하기 */
    // ex) 요청으로 아무 값이 들어오지 않을 경우 or 다른 타입의 데이터가 들어왔을 경우
    // ex) 내가 찾는 데이터가 디비에 없을 경우
    // ex) 토큰이 유효하지 않을경우

        if(!req){
            errResponse(res, returnCode.BAD_REQUEST, '요청된 데이터가 없습니다.');
        }
        if(!test){
            errResponse(res, returnCode.BAD_REQUEST, '무슨 데이터가 없습니다');
        }
//        response(res, returnCode.OK, '테스트 조회 성공', test); // 응답으로 데이터 줄때
        response(res, returnCode.OK, '테스트 조회 성공'); // 응답으로 데이터를 보내주지 않고, 응답코드와 메시지만 보내줄 경우

    } catch (error) {
        console.log(error);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, '서버 오류');
    }
}

module.exports = {
    getTest
}
