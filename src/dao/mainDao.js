const mysql = require('../library/mysql');

async function selectMainToday(date, userIdx) {  // 해당 요일 복용 체크 조회
    const selectMainCheckSql = `SELECT doesCheckIdx, does_dt, pre_medicine_name, total_does_count, total_does_dt, my_does_dt, does_check 
    FROM PRESCRIPTION_MEDICINE left JOIN DOES_CHECK 
    ON PRESCRIPTION_MEDICINE.preMedicineIdx = DOES_CHECK.preMedicineIdx 
    left JOIN PRESCRIPTION 
    ON PRESCRIPTION_MEDICINE.prescriptionIdx = PRESCRIPTION.prescriptionIdx WHERE does_dt = ? AND userIdx = ?
    ORDER BY prescription_dt ASC`;
    return await mysql.query(selectMainCheckSql, [date, userIdx]);
}

// Select * From A left JOIN B
// ON A.name = B.name
// left JOIN C
// ON A.name = C.name
////////////////////////////////////////////////////////////////////////////////

async function insertMainPrescription(userIdx, body) {  // 처방전 등록
    const insertPrescriptionSql = `INSERT INTO PRESCRIPTION (prescription_dt, userIdx) 
    VALUES (?, ?)`;
    return await mysql.query(insertPrescriptionSql, [body.prescription_dt, userIdx]);
}

async function insertMainMedicine(insertIdx, body) {  // 처방약 등록
    const insertMedicineSql = `INSERT INTO PRESCRIPTION_MEDICINE 
    (prescriptionIdx, pre_medicine_name, total_does_dt, my_does_dt, total_does_count) 
    VALUES (?, ?, ?, ?, ?)`;
    return await mysql.query(insertMedicineSql, 
        [insertIdx, body.pre_medicine_name, body.total_does_dt, 0, body.total_does_count]);
}

async function insertMainDoesCheck(insertIdx, does_dt) {  // 복용 체크 등록
    const insertDoesCheckSql = `INSERT INTO DOES_CHECK 
    (preMedicineIdx, does_dt, does_check) VALUES (?, ?, ?)`;
    return await mysql.query(insertDoesCheckSql, [insertIdx, does_dt, 0]);
}

////////////////////////////////////////////////////////////////////////////////

async function updateMainCheck(doesCheckIdx) {  // 복용 체크
    const updateMainCheckSql = `UPDATE DOES_CHECK SET does_check = ? WHERE doesCheckIdx = ?`;
    return await mysql.query(updateMainCheckSql, [1, doesCheckIdx]);
}

async function updateMainCheckCancel(doesCheckIdx) {  // 복용 체크 취소
    const updateMainCheckCancelSql = `UPDATE DOES_CHECK SET does_check = ? WHERE doesCheckIdx = ?`;
    return await mysql.query(updateMainCheckCancelSql, [0, doesCheckIdx]);
}

async function selectMainDoesCheck(doesCheckIdx) {  // 복용일 수정을 위한 DOES_CHECK 조회
    const selectMainDoesCheckSql = `SELECT preMedicineIdx, does_check FROM DOES_CHECK WHERE doesCheckIdx = ?`;
    return await mysql.query(selectMainDoesCheckSql, [doesCheckIdx]);
}

async function selectMainMyDoes(preMedicineIdx) {  // 복용일 수정을 위한 PRESCRIPTION_MEDICINE 조회
    const selectMainMyDoesSql = `SELECT total_does_dt, my_does_dt FROM PRESCRIPTION_MEDICINE WHERE preMedicineIdx = ?`;
    return await mysql.query(selectMainMyDoesSql, [preMedicineIdx]);
}

async function updateMainMyDoes(preMedicineIdx) {  // 복용 체크 -> 복용일 +1
    const updateMainMyDoesSql = `UPDATE PRESCRIPTION_MEDICINE SET my_does_dt = my_does_dt +1 WHERE preMedicineIdx = ?`;
    return await mysql.query(updateMainMyDoesSql, [preMedicineIdx]);
}

async function updateMainMyDoesCancel(preMedicineIdx) {  // 복용 체크 취소 -> 복용일 -1
    const updateMainMyDoesCancelSql = `UPDATE PRESCRIPTION_MEDICINE SET my_does_dt = my_does_dt -1 WHERE preMedicineIdx = ?`;
    return await mysql.query(updateMainMyDoesCancelSql, [preMedicineIdx]);
}

module.exports = {
    selectMainToday,
    insertMainPrescription,
    insertMainMedicine,
    insertMainDoesCheck,
    updateMainCheck,
    updateMainCheckCancel,
    selectMainDoesCheck,
    selectMainMyDoes,
    updateMainMyDoes,
    updateMainMyDoesCancel
}