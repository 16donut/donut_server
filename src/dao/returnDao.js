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

/* 버릴약 목록 전체조회 (최신순)
    userIdx, prescriptionIdx, preMedicineIdx, pre_medicine_name, expireIdx, expire_dt, abandon_check
    -   Error   -
*/
async function selectReturnExpiredao(userIdx){
    const selectExpireList = `
    SELECT pr.userIdx, pm.prescriptionIdx, pm.preMedicineIdx, pm.pre_medicine_name, ex.expireIdx, ex.expire_dt, ex.abandon_check
    FROM PRESCRIPTION as pr, PRESCRIPTION_MEDICINE as pm, EXPIRE_MEDICINE as ex
    WHERE pr.prescriptionIdx = pm.prescriptionIdx AND pm.preMedicineIdx = ex.preMedicineIdx
    AND pr.userIdx = ?
    AND ex.abandon_check = 0
    ORDER BY ex.expire_dt;`;

    return await mysql.query(selectExpireList, [userIdx]);
}


/* 버릴약 목록 회수 완료
    - abandon_check = 0 일 경우에만 변경
*/
async function updateExpireCheckdao(expireIdx) { 
    const updateExpireCheckSql = `
    UPDATE donut_schema.EXPIRE_MEDICINE 
    SET abandon_check = CASE 
	    WHEN abandon_check = 0 THEN 1
	    ELSE abandon_check END
    WHERE expireIdx = ? ;
    `;
    return await mysql.query(updateExpireCheckSql, [expireIdx]);
}
async function selectExpireCheckdao(expireIdx) { 
    const updateExpireCheckSql = `
    SELECT *
    FROM donut_schema.EXPIRE_MEDICINE
    WHERE expireIdx =?
    AND abandon_check = 1;
    `;
    return await mysql.query(updateExpireCheckSql, [expireIdx]);
}




// 해당 유저의 expireIdx가 맞는지 검사
async function checkExpireUserdao(userIdx, expireIdx){
    const checkExpireUserSql = `
    SELECT pr.userIdx, ex.expireIdx
    FROM donut_schema.PRESCRIPTION as pr, donut_schema.PRESCRIPTION_MEDICINE as pm, donut_schema.EXPIRE_MEDICINE as ex
    WHERE pr.prescriptionIdx = pm.prescriptionIdx AND pm.preMedicineIdx = ex.preMedicineIdx
    AND pr.userIdx = ?
    AND ex.expireIdx = ?;
    `;

    return await mysql.query(checkExpireUserSql,[userIdx,expireIdx]);
}


module.exports = {
    selectPharmacydao,
    selectReturnExpiredao,
    updateExpireCheckdao,
    checkExpireUserdao,
    selectExpireCheckdao
}

