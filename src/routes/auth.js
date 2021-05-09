var express = require('express');
var router = express.Router();

var authController = require('../controller/authController.js')
/*
router.post('/signin', authController.postAuthSignin);    // 로그인
router.post('/signup', authController.postAuthSignup);    // 회원가입
*/
module.exports = router;