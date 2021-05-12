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
module.exports = {
    selectPharmacydao,
    insertPharmacydao
}

