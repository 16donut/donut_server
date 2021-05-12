var express = require('express');
var router = express.Router();

var calendarController = require('../controller/calendarController.js')



router.get('/expire', calendarController.getCalendarExpire);    // 이달의 버릴 약조회
router.get('/eat', calendarController.getCalendarEat);    // 이달의 먹은 약조회
router.get('/noeat', calendarController.getCalendarNoEat);    // 이달의 안먹은 약조회

module.exports = router;