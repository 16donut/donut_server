const { response, errResponse } = require('../library/response');
const returnCode = require('../library/returnCode');
const { verify } = require('../library/jwt');

const mainService = require('../service/mainService');

async function getMainExpire(req, res) {  // 버릴약목록전체조회(최신순)
}
async function getMainCheck(req, res) {  // 일별복용체크조회
}
async function postMainCheck(req, res) {  // 일별복용체크추가
}
async function putMainCheck(req, res) {  // 일별복용체크수정
}
async function postMainQrcode(req, res) {  // QR코드처방전등록
}

module.exports = {
    getMainExpire,
    getMainCheck,
    postMainCheck,
    putMainCheck,
    postMainQrcode
}
