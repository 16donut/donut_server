var express = require('express');
var router = express.Router();

/* 라우팅 필요할 때 주석 지우세요 */
router.use("/auth", require("./auth"));
router.use("/main", require("./main"));
router.use("/calendar", require("./calendar"));
router.use("/return", require("./return"));
router.use("/mypage", require("./mypage"));


// 공부용으로 만든것
// router.use("/test", require("./test"))

module.exports = router;