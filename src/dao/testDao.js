const mysql = require('../library/mysql');

/*
async function selectTestList() {    // 찾으려는 데이터 조회
    const selectMovieSql = `SELECT * FROM user`;
    return await mysql.query(selectTestSql);
}

async function selectTestList(req) {    // 쿼리에 데이터를 넣어야 하는 경우
    const selectMovieSql = `SELECT * FROM user WHERE = ?`;
    return await mysql.query(selectTestSql, req);
}
*/

module.exports = {
    selectTestList
}