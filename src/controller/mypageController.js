const { response, errResponse } = require('../library/response');
const returnCode = require('../library/returnCode');
const { verify } = require('../library/jwt');

const mypageService = require('../service/mypageService');

async function getMypageInfo(req, res) {  // 내정보 조회
}
async function getMypagePrescription(req, res) {  // 처방전목록조회(최신순)
}
async function postMypageMedicine(req, res) {  // 1개의처방전약품조회(가나다)
}

module.exports = { 
    getMypageInfo,
    getMypagePrescription,
    postMypageMedicine
}
