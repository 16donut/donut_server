const mypageDao = require('../dao/mypageDao');

/* 내 정보 조회
    user = userIdx, user_id, user_name, user_access_dt
    -   Error   -
    * 토큰값 검사로 불필요
*/
async function getMypageInfoService(userIdx){
    const user = await mypageDao.selectUserInfo(userIdx);

    // 유저 데이터
    const UserData = {
        "user_id" : "",
        "user_name" : ""
    };
    UserData.user_id = user[0].user_id;
    UserData.user_name = user[0].user_name;

    return UserData;
}


/* 처방전 리스트 조회 (최신순)
    prescriptionIdx, prescription_dt
    -   Error   -
    1. 처방전이 없을 경우
    
    -   주의  -
    2. 조회는 성공했으나 개수가 0개인 경우
*/
async function getMypagePrescriptionService(userIdx){
    const prescriptionList = await mypageDao.selectPrescriptionList(userIdx);

    // 1. 처방전이 없을 경우
    if(prescriptionList == null){
        return -2
    }
    // 2. 조회는 성공했으나 개수가 0개인 경우
    else if(prescriptionList.length == 0){
        return -3;
    }
    let prescriptionArray= new Array;

    for (let i = 0 ; i<prescriptionList.length; i++){
        let prescription = {
            "prescriptionIdx" : "",
            "prescription_dt" : Date
        };

        prescription.prescriptionIdx = prescriptionList[i].prescriptionIdx;
        prescription.prescription_dt = prescriptionList[i].prescription_dt;
        prescriptionArray.push(prescription);
    };

    return prescriptionArray;

}

/* 1개의 처방전 약품 조회(가나다)
    prescriptionIdx, preMedicineIdx, pre_medicine_name, total_dose_dt, my_does_dt, total_does_count
    -   Error   -
    1. 요청이 없을 경우 (처방전이 없을 경우)
    2. 해당하는 처방전이 없는 경우
    3. 약을 찾을 수 없거나, 개수가 음수일 경우
*/
async function getONEPrescriptionService(prescriptionIdx){
    // 1. 요청이 존재하지 않을 경우
    if(prescriptionIdx== null){
        return -1;
    }

    const onePrescription = await mypageDao.selectONEPrescription(prescriptionIdx);
    // 2. 해당하는 처방전이 없는 경우
    if(onePrescription.length == 0){
        return -2;
    }
    let prescriptionArray= new Array;

    for (let i = 0 ; i<onePrescription.length; i++){
        let prescription = {
            "prescriptionIdx" : "",
            "preMedicineIdx" : "",
            "pre_medicine_name" : "",
            "total_dose_dt" : 0,
            "my_does_dt" : 0,
            "total_does_count" : 0
        };

        prescription.prescriptionIdx = onePrescription[i].prescriptionIdx;
        prescription.preMedicineIdx = onePrescription[i].preMedicineIdx;
        prescription.pre_medicine_name = onePrescription[i].pre_medicine_name;
        prescription.total_dose_dt = onePrescription[i].total_dose_dt;
        prescription.my_does_dt = onePrescription[i].my_does_dt;
        prescription.total_does_count = onePrescription[i].total_does_count;

        // 3. 약을 찾을 수 없거나, 개수가 음수일 경우
        if(prescription.total_does_count < 0){
            return -3
        }
        prescriptionArray.push(prescription);
    };

    return prescriptionArray;
}


module.exports = {
    getMypageInfoService,           // 유저 정보 조회
    getMypagePrescriptionService,   // 처방전 리스트 조회
    getONEPrescriptionService       // 한개의 처방전 조회
}