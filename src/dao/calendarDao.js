const mysql = require('../library/mysql');

async function selectEatMedicine(user_idx){
    const EatMedicinedSql = `
    SELECT pm.preMedicineIdx as idx, pm.pre_medicine_name as name, dc.does_dt as date
    FROM PRESCRIPTION AS ps, PRESCRIPTION_MEDICINE AS pm, DOES_CHECK AS dc
    WHERE ps.userIdx = ? AND ps.prescriptionIdx = pm.prescriptionIdx AND pm.preMedicineIdx =dc.preMedicineIdx AND dc.does_check = 1
    ORDER BY date ASC, idx ASC
    `;
    const param = [user_idx];
    return await mysql.query(EatMedicinedSql, param);
}

async function selectNoEatMedicine(user_idx){
    const noEatMedicineSql = `
    SELECT pm.preMedicineIdx as idx, pm.pre_medicine_name as name, dc.does_dt as date
    FROM PRESCRIPTION AS ps, PRESCRIPTION_MEDICINE AS pm, DOES_CHECK AS dc
    WHERE ps.userIdx = ? AND ps.prescriptionIdx = pm.prescriptionIdx AND pm.preMedicineIdx =dc.preMedicineIdx 
    AND dc.does_check = 0
    ORDER BY date ASC, idx ASC
    `;
    const param = [user_idx];
    return await mysql.query(noEatMedicineSql, param);
}

async function selectAbandonMedicine(user_idx){
    const abandonMedicineSql = `
    SELECT pm.preMedicineIdx as idx, pm.pre_medicine_name as name, em.expire_dt as date
    FROM EXPIRE_MEDICINE as em, PRESCRIPTION AS ps, PRESCRIPTION_MEDICINE AS pm, DOES_CHECK AS dc
    WHERE ps.userIdx = ? AND ps.prescriptionIdx = pm.prescriptionIdx AND pm.preMedicineIdx =dc.preMedicineIdx AND dc.does_check = 0 
    AND em.preMedicineIdx = pm.preMedicineIdx AND em.expire_dt < now()
    ORDER BY date ASC, idx ASC
    `
    const param = [user_idx];
    return await mysql.query(abandonMedicineSql, param);
}
module.exports = {
    selectEatMedicine: selectEatMedicine,
    selectNoEatMedicine: selectNoEatMedicine,
    selectAbandonMedicine: selectAbandonMedicine
}