var express = require('express');
var router = express.Router();

var mypageController = require('../controller/mypageController.js')

/* 필요할 때마다 주석 제거해서 사용
router.get('/info, mypageController.getMypageInfo);    // 내정보조회
router.get('/prescription', mypageController.getMypagePrescription);    // 처방전목록조회(최신순)
router.get('/medicine', mainController.postMypageMedicine);    // 1개의처방전약품조회(가나다)
*/

module.exports = router;