const mysql = require('../library/mysql');

// user 데이터 조회
async function selectUserInfo(user_id) {    // 쿼리에 데이터를 넣어야 하는 경우
    const selectUserSql = `SELECT user_id, user_name FROM USER WHERE user_id = ?`;
    return await mysql.query(selectUserSql, [user_id]);
}

// 처방전 리스트 조회
async function selectPrescriptionList(user_id){
    const [selectList] = `SELECT prescriptionIdx FROM PRESCRIPTION WHERE user_id = ? ORDER BY prescription_dt DESC`;
    return await mysql.query(selectList, [user_id]);
}


// 1개의 처방전 약품조회
// async function selectMyPagePrescription(user_id){
//     const [selectUserId] = `SELECT prescriptionIdx FROM PRESCRIPTION WHERE = ?`;
//     const user_prescription = await mysql.query(selectUserId, [user_id]);


//     const selectMovieSql = `SELECT allMedicineIdx, total_dose_dt, my_dose_dt FROM PRESCRIPTION WHERE = ?`;
//     return await mysql.query(selectMovieSql, [user_prescription]);
    
//     const selectMovieSql = `SELECT prescriptionIdx ,allMedicineIdx, total_dose_dt, my_dose_dt FROM PRESCRIPTION, USER WHERE USER.user_id = PRESCRIPTION.user_id and PRESCRIPTION.user_id = ?`;
//     return await mysql.query(selectMovieSql, [user_prescription]);
// }
module.exports = {
    selectUserInfo,
    selectPrescriptionList
    // selectMyPagePrescription
}