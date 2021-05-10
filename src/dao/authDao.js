const mysql = require('../library/mysql');

/* 회원가입 
user = userIdx, user_id, user_pwd, user_name, user_salt, user_access_dt
1. 요청 데이터가 부족할 경우
2. 아이디가 중복일 경우
*/ 

async function selectUserId(user_id) {  // 존재하는 유저 조회
    const selectUserIdSql = `SELECT user_id FROM USER WHERE user_id = ?`;
    return await mysql.query(selectUserIdSql, [user_id]);
}

async function selectUserInfo(user_id) {  // 존재하는 유저 & user_salt & user_pwd 조회
    const selectUserIdSql = `SELECT user_id, user_salt, user_pwd FROM USER WHERE user_id = ?`;
    return await mysql.query(selectUserIdSql, [user_id]);
}

async function insertUserSignup(body) {  // 회원가입 유저 등록
    const insertUserSignupSql = `INSERT INTO USER (user_id, user_pwd, user_name, user_salt, user_access_dt) VALUES (?, ?, ?, ?, ?)`;
    return await mysql.query(insertUserSignupSql, 
        [body.user_id, body.user_pwd, body.user_name, body.user_salt, body.user_access_dt]);
}

async function updateUserAccess(body) {  // 로그인 유저 마지막 로그인 갱신
    const updateUserAccessSql = `UPDATE USER SET user_access_dt = ? WHERE user_id = ?`;
    return await mysql.query(updateUserAccessSql, [body.user_access_dt, body.user_id]);
}

module.exports = {
    selectUserId,
    selectUserInfo,
    insertUserSignup,
    updateUserAccess
}