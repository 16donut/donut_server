var express = require('express');
var router = express.Router();

var mainController = require('../controller/mainController.js')


router.get('/expire', mainController.getMainExpire);    // 버릴약목록전체조회(최신순)
router.get('/check', mainController.getMainCheck);    // 일별복용체크조회
router.put('/check', mainController.putMainDoesCheck);    // 일별복용체크수정
router.put('/check/cancel', mainController.putMainDoesCheckCancel);    // 일별복용체크수정
// router.post('/qrcode', mainController.postMainQrcode);    // QR코드처방전등록
router.post('/prescription', mainController.postMainPrescription);    // 처방약, 처방전 자동등록


module.exports = router;