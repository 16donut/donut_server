const mypageDao = require('../dao/mypageDao');

/* 내 정보 조회
    user = userIdx, user_id, user_name, user_access_dt
    -   Error   -
    1. 아이디가 존재하지 않을 경우
*/
async function getMypageInfo(user_id){
    // const user_id = body.user_id;
    
    //요청 바디가 없을 경우
    if(!user_id){
        return -1;
    }

    const selectUserInfo = await mypageDao.selectUserInfo(user_id);
    
    // 유저가 존재하지 않을 경우
    if(selectUserInfo.length == 0) { 
        return -2;
    }

    // 해당 유저 데이터
    const UserData = {
        "user_id" : "",
        "user_name" : ""
    };
    UserData.user_id = selectUserInfo[0].user_id;
    UserData.user_name = selectUserInfo[0].user_name;

    return UserData;
}

/* 처방전 리스트 조회
    prescriptionIdx, prescription_dt
    -   Error   -
    1. 처방전이 없을 경우
*/
async function postMypageMedicine(user_id){
    const [prescriptionList] = await mypageDao.selectPrescriptionList(user_id);

    // 처방전이 없을 경우
    if(prescriptionList.length == 0){
        return -1;
    }
    let prescription = {
        "prescriptionIdx" : "",
        "prescription_dt" : Date
    };

    for (let i = 0 ; i<prescriptionList.length; i++){
        prescription.prescriptionIdx = prescriptionList[i].prescriptionIdx;
        prescription.prescription_dt = prescriptionList[i].prescription_dt;
    };

    return prescription;
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
    getMypageInfo    // 유저 정보 조회
}