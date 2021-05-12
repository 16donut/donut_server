const { response, errResponse } = require('../library/response');
const returnCode = require('../library/returnCode');
const { verify } = require('../library/jwt');

const returnService = require('../service/returnService');

async function postReturnExpire(req, res) {  // 버릴약목록전체조회(최신순)
}
async function deleteReturnExpire(req, res) {  // 버릴약목록삭제(회수완료)
}

async function insertAroundPharmacy(req, res){ // 내 위치 주변 약국 등록(2km)
    try{

        var check = await returnService.insertPharmacy(req.body);

        if(check == -1){
            response(res, returnCode.BAD_REQUEST, '우리나라가 아닙니다.');
        }
        if(check == 1){
        response(res, returnCode.OK, '약국 등록 완료');
        }


    } catch (error) {
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}
async function getReturnPharmacy(req, res) {  // 약국조회(gps->가나다)

    try{

        var pharmacyData = await returnService.selectPharmacy(req);
    
        if(!pharmacyData){
            errResponse(res, returnCode.BAD_REQUEST, 'no data');
        }

        response(res, returnCode.OK, '데이터가 검색 되었습니다.', pharmacyData);

    } catch (error) {
        console.log(error.message);
        errResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}


module.exports = {
    postReturnExpire,
    deleteReturnExpire,
    getReturnPharmacy,
    insertAroundPharmacy
}
