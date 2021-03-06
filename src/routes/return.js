var express = require('express');
var router = express.Router();

var returnController = require('../controller/returnController.js')


router.put('/expire', returnController.putReturnExpire);    // 버릴약목록삭제(회수완료)
router.get('/expire', returnController.getReturnExpire);    // 버릴약목록전체조회(최신순)
router.get('/pharmacy', returnController.getReturnPharmacy);    // 약국조회(gps->가나다)\
module.exports = router;