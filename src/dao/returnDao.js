const mysql = require('../library/mysql');

async function selectPharmacydao(xpos, ypos){
    
    const selectPharmacySql = `SELECT *,

    (6371*acos(cos(radians(?))*cos(radians(pharmacy_latitude))*cos(radians(pharmacy_longitude)
    
    -radians(?))+sin(radians(?))*sin(radians(pharmacy_latitude))))
    
    AS distance
    
    FROM PHARMACY
    
    HAVING distance <= 2
    
    ORDER BY distance 
    
    LIMIT 0,300`;
    const param = [ypos, xpos, ypos];
    return await mysql.query(selectPharmacySql,param);
}

async function insertPharmacydao(pharmacyInfo){
    const insertPharmacySql = `
    INSERT INTO PHARMACY(pharmacy_name, pharmacy_address, pharmacy_number, pharmacy_longitude, pharmacy_latitude)
    SELECT ?,?,?,?,?
    WHERE NOT EXISTS 
    (SELECT * FROM PHARMACY WHERE pharmacy_longitude = ? AND pharmacy_latitude = ?)`;
    const params = [pharmacyInfo.name, pharmacyInfo.address, pharmacyInfo.phone_number, pharmacyInfo.longitude, pharmacyInfo.latitude, pharmacyInfo.longitude, pharmacyInfo.latitude];
    await mysql.query(insertPharmacySql,params);
}

/* 버릴약 목록 전체조회 (최신순)
    userIdx, prescriptionIdx, preMedicineIdx, pre_medicine_name, expireIdx, expire_dt, abandon_check
    -   Error   -
*/
async function selectReturnExpiredao(userIdx){
    const selectExpireList = `
    SELECT pr.userIdx, pm.prescriptionIdx, pm.preMedicineIdx, pm.pre_medicine_name, ex.expireIdx, ex.expire_dt, ex.abandon_check
    FROM donut_schema.PRESCRIPTION as pr, donut_schema.PRESCRIPTION_MEDICINE as pm, donut_schema.EXPIRE_MEDICINE as ex
    WHERE pr.prescriptionIdx = pm.prescriptionIdx AND pm.preMedicineIdx = ex.preMedicineIdx
    AND pr.userIdx = ?
    AND ex.abandon_check = 0
    ORDER BY ex.expire_dt;`;

    return await mysql.query(selectExpireList, [userIdx]);
}

module.exports = {
    selectPharmacydao,
    insertPharmacydao,
    selectReturnExpiredao
}

