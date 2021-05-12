const mysql = require('../library/mysql');

// user 데이터 조회
async function selectUserInfo(userIdx) {    
    const selectUserSql = `SELECT user_id, user_name FROM USER WHERE userIdx = ?`;
    return await mysql.query(selectUserSql, userIdx);
}

// 처방전 리스트 조회 (최신순)
async function selectPrescriptionList(userIdx) {
    const selectListSql = `SELECT prescriptionIdx, prescription_dt FROM PRESCRIPTION WHERE userIdx = ? ORDER BY prescription_dt DESC`;
    return await mysql.query(selectListSql, userIdx);
}


// 1개의 처방전 약품조회 (가나다)
async function selectONEPrescription(prescriptionIdx){
    const selectONEPrescription = `
    SELECT prescriptionIdx, preMedicineIdx, pre_medicine_name,total_does_dt,my_does_dt, total_does_count
    FROM PRESCRIPTION_MEDICINE 
    WHERE prescriptionIdx = ?
    ORDER BY pre_medicine_name`;
    return await mysql.query(selectONEPrescription, prescriptionIdx);
}


module.exports = {
    selectUserInfo,
    selectPrescriptionList,
    selectONEPrescription
}