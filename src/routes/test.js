var express = require('express');
var router = express.Router();

var testController = require('../controller/testController.js')

router.get('/', testController.getTest);    // 테스트용

module.exports = router;