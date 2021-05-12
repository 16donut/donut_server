var express = require('express');
var router = express.Router();

var returnController = require('../controller/returnController.js')

/* 필요할 때마다 주석 제거해서 사용
router.post('/expire', returnController.postReturnExpire);    // 버릴약목록전체조회(최신순)
router.delete('/expire', returnController.deleteReturnExpire);    // 버릴약목록삭제(회수완료)
*/


router.get('/pharmacy', returnController.getReturnPharmacy);    // 약국조회(gps->가나다)
router.post('/pharmacy', returnController.insertAroundPharmacy);
module.exports = router;