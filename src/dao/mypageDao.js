const mysql = require('../library/mysql');

// user 데이터 조회
async function selectUserInfo(userIdx) {    
    const selectUserSql = `SELECT user_id, user_name FROM USER WHERE userIdx = ?`;
    return await mysql.query(selectUserSql, userIdx);
}

// 처방전 리스트 조회
async function selectPrescriptionList(userIdx) {
    // ORDER BY prescription_dt DESC
    console.log("22");
    const selectListSql = `SELECT prescriptionIdx FROM PRESCRIPTION WHERE userIdx = ?`;
    console.log("11");
    console.log(selectListSql);
    return await mysql.query(selectListSql, userIdx);
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