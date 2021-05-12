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


/* 처방전 리스트 조회
    prescriptionIdx, prescription_dt
    -   Error   -
    1. 처방전이 없을 경우
*/
async function getMypagePrescriptionService(userIdx){
    const prescriptionList = await mypageDao.selectPrescriptionList(userIdx);
    console.log(prescriptionList);

    // 1. 처방전이 없을 경우
    if(prescriptionList.length == 0){
        return -1;
    }
    let prescriptionArray= new Array;

    console.log(prescriptionList.length);
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

/* 1개의 처방전 약품 조회
    prescriptionIdx, allMedicineIdx, total_dose_dt, my_dose_dt
    -   Error   -
    1. 처방전이 없을 경우
    2. 최대 복용 기간이 음수거나 계산할 수 없을 경우
*/
// async function postMypageMedicine(user_id){
//     const userPrescription = await mypageDao.selectMyPagePrescription(user_id);
//     let myPrescription = {
//         "prescriptionIdx" : "",
//         "allMedicineIdx" : [],
//         "total_dose_dt" : Date,
//         "my_dose_dt" : Date,
//         "maxDose_dt" : 0
//     }


//     // 처방전이 존재하지 않을 경우
//     if(userPrescription.length == 0){
//         return -1;
//     }
// }


module.exports = {
    getMypageInfoService,    // 유저 정보 조회
    getMypagePrescriptionService
}