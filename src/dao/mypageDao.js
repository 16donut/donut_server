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
async function selectONEPrescription(userIdx, prescriptionIdx){
    const selectONEPrescription = `
    SELECT PRESCRIPTION.userIdx, PRESCRIPTION_MEDICINE.prescriptionIdx, PRESCRIPTION_MEDICINE.preMedicineIdx, PRESCRIPTION_MEDICINE.pre_medicine_name, PRESCRIPTION_MEDICINE.total_does_dt, PRESCRIPTION_MEDICINE.my_does_dt, PRESCRIPTION_MEDICINE.total_does_count
    FROM donut_schema.PRESCRIPTION
    LEFT OUTER JOIN PRESCRIPTION_MEDICINE ON PRESCRIPTION.prescriptionIdx = PRESCRIPTION_MEDICINE.prescriptionIdx
    WHERE PRESCRIPTION.userIdx = ?
    AND PRESCRIPTION.prescriptionIdx = ?
    ORDER BY pre_medicine_name;`;
    return await mysql.query(selectONEPrescription, [userIdx, prescriptionIdx]);
}


module.exports = {
    selectUserInfo,
    selectPrescriptionList,
    selectONEPrescription
}