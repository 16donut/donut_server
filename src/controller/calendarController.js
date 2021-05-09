const { response, errResponse } = require('../library/response');
const returnCode = require('../library/returnCode');
const { verify } = require('../library/jwt');

const calendarService = require('../service/calendarService');

async function getCalendarEat(req, res) {  // 이달의 먹은 약 조회
}
async function getCalendarNoEat(req, res) {  // 이달의 안먹은 약 조회
}
async function getCalendarExpire(req, res) {  // 이달의 버릴 약 조회
}

module.exports = {
    getCalendarEat,
    getCalendarNoEat,
    getCalendarExpire
}
