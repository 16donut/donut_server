const { response, errResponse } = require('../library/response');
const returnCode = require('../library/returnCode');
const { verify } = require('../library/jwt');

const returnService = require('../service/returnService');

async function postReturnExpire(req, res) {  // 버릴약목록전체조회(최신순)
}
async function deleteReturnExpire(req, res) {  // 버릴약목록삭제(회수완료)
}
async function getReturnPharmacy(req, res) {  // 약국조회(gps->가나다)
}

module.exports = {
    postReturnExpire,
    deleteReturnExpire,
    getReturnPharmacy
}
