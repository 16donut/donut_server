var express = require('express');
var router = express.Router();

var mypageController = require('../controller/mypageController.js')


router.get('/info', mypageController.getMypageInfo);    //내 정보 조회
router.get('/prescription', mypageController.getMypagePrescription);    // 처방전목록조회(최신순)
router.get('/medicine', mypageController.getONEPriscription);    // 1개의처방전약품조회(가나다)


module.exports = router;