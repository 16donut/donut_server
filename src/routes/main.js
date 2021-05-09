var express = require('express');
var router = express.Router();

var mainController = require('../controller/mainController.js')

/* 필요할 때마다 주석 제거해서 사용
router.get('/expire', mainController.getMainExpire);    // 버릴약목록전체조회(최신순)
router.get('/check', mainController.getMainCheck);    // 일별복용체크조회
router.post('/check', mainController.postMainCheck);    // 일별복용체크추카
router.put('/check', mainController.putMainCheck);    // 일별복용체크수정
router.post('/qrcode', mainController.postMainQrcode);    // QR코드처방전등록
*/

module.exports = router;