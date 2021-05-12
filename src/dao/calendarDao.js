const mysql = require('../library/mysql');

async function selectEatMedecine(user_idx){
    const EatMedecinecSql = `
    SELECT pm.pre_medicine_name as name, dc.does_dt as date
    FROM PRESCRIPTION AS ps, PRESCRIPTION_MEDICINE AS pm, DOES_CHECK AS dc
    WHERE ps.userIdx = ? AND ps.prescriptionIdx = pm.prescriptionIdx AND pm.preMedicineIdx =dc.preMedicineIdx AND dc.does_check = 1
    ORDER BY date DESC
    `;
    const param = [user_idx];
    return await mysql.query(EatMedecinecSql, param);
}

async function selectDontEatMedecine(user_idx){
    const dontEatMedecineSql = `
    SELECT pm.pre_medicine_name as name, ps.prescription_dt as date, am.medicine_max_dt as max_date
    FROM PRESCRIPTION AS ps, PRESCRIPTION_MEDICINE AS pm, DOES_CHECK AS dc, ALL_MEDICINE AS am
    WHERE ps.userIdx = ? AND ps.prescriptionIdx = pm.prescriptionIdx AND pm.preMedicineIdx =dc.preMedicineIdx 
    AND dc.does_check = 0 AND am.medicine_name = pm.pre_medicine_name
    ORDER BY date DESC
    `;
    const param = [user_idx];
    return await mysql.query(dontEatMedecineSql, param);
}

async function selectAbandonMedecine(user_idx){
    const abandonMedecineSql = `
    SELECT pm.pre_medicine_name as name, em.expire_dt as date
    FROM EXPIRE_MEDICINE as em, PRESCRIPTION AS ps, PRESCRIPTION_MEDICINE AS pm, DOES_CHECK AS dc
    WHERE ps.userIdx = ? AND ps.prescriptionIdx = pm.prescriptionIdx AND pm.preMedicineIdx =dc.preMedicineIdx AND dc.does_check = 0 
    AND em.preMedicineIdx = pm.preMedicineIdx AND em.expire_dt < now()
    ORDER BY date DESC
    `
    const param = [user_idx];
    return await mysql.query(abandonMedecineSql, param);
}
module.exports = {
    selectEatMedecine,
    selectDontEatMedecine,
    selectAbandonMedecine
}