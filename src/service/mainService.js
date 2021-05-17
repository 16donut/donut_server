const mainDao = require('../dao/mainDao');
const moment = require('moment');

/* 일별 복용 체크 조회 */ 
async function getMainDoesCheck(userIdx) {
    let today = moment().format('YYYY-MM-DD'); // 오늘의 날짜 조회

    console.log(today)
    const selectTodayResult = await mainDao.selectMainToday(today, userIdx); // Idx, does_check

    // const doesCheckIdx = selectTodayResult[0].doesCheckIdx; // idx
    // const does_dt = selectTodayResult[0].does_dt; // 복용일
    // const pre_medicine_name = selectTodayResult[0].pre_medicine_name; // 약 이름
    // const total_does_count = selectTodayResult[0].total_does_count; // 하루 복용 횟수
    // const does_check = selectTodayResult[0].does_check; // 복용 체크
    // const total_does_dt = selectTodayResult[0].total_does_dt; // 총 복용일
    // const my_does_dt = selectTodayResult[0].my_does_dt; // 내 복용일

    const allData = {
        "does_dt" : today,
        "todayDoesList" : []
    };

    for(let i =0; i<selectTodayResult.length; i++){
        const todayData = {
            "doesCheckIdx": 0,
            "pre_medicine_name" : "",
            "total_does_count" : 0
        }
        // 복용 체크 된 것 && 총 복용 수 넘은 것 안보여주기
        if(selectTodayResult[i].does_check == 0 || selectTodayResult[i].my_does_dt >= selectTodayResult[0].total_does_dt){
            todayData.doesCheckIdx = selectTodayResult[i].doesCheckIdx;
            todayData.pre_medicine_name = selectTodayResult[i].pre_medicine_name;
            todayData.total_does_count = selectTodayResult[i].total_does_count;
            allData.todayDoesList.push(todayData);
        }
    }
    return allData;
}

/* 일별 복용 체크 */
async function putMainDoesCheck(body) { 
    const doesCheckIdx = body.doesCheckIdx; // 일별 복용 체크 고유 번호

    if(!doesCheckIdx){ // 요청 바디가 부족할 경우
        return -1;
    }
    const selectCheckResult = await mainDao.selectMainDoesCheck(doesCheckIdx); // Idx, does_check

    const preMedicineIdx = selectCheckResult[0].preMedicineIdx; // 처방 약 idx
    const does_check = selectCheckResult[0].does_check; // 일일 복용 체크

    const selectDoesResult = await mainDao.selectMainMyDoes(preMedicineIdx); // preMedicineIdx, my_does_dt

    const my_does_dt = selectDoesResult[0].my_does_dt; //  내가 복용한 일
    const total_does_dt = selectDoesResult[0].total_does_dt; // 총 복용일

    if(my_does_dt >= total_does_dt){ //  내 복용일이 총 복용일 보다 높을 경우
        return -2;
    }
    else if(does_check == 1){
        return -2;
    }
    const doesCheckResult = await mainDao.updateMainCheck(doesCheckIdx); // 복용 체크 1
    const myDoesResult = await mainDao.updateMainMyDoes(preMedicineIdx); // 내가 복용한 일 +1

    if(!doesCheckResult || !myDoesResult) { // DB에 갱신하지 못했을 경우
        return -4;
    }
    return 0;
}

/* 일별 복용 체크 취소 */
async function putMainDoesCheckCancel(body) {  
    const doesCheckIdx = body.doesCheckIdx; // 일별 복용 체크 고유 번호

    if(!doesCheckIdx){ // 요청 바디가 부족할 경우
        return -1;
    }
    const selectCheckResult = await mainDao.selectMainDoesCheck(doesCheckIdx); // preMedicineIdx, my_does_dt

    const preMedicineIdx = selectCheckResult[0].preMedicineIdx; // 처방 약 idx
    const does_check = selectCheckResult[0].does_check; // 일일 복용 체크

    const selectDoesResult = await mainDao.selectMainMyDoes(preMedicineIdx); // preMedicineIdx, my_does_dt

    console.log(selectDoesResult[0].my_does_dt);
    const my_does_dt = selectDoesResult[0].my_does_dt; //  내가 복용한 일
    
    if(my_does_dt <= 0){ //  내 복용일이 0보다 작을 경우
        return -2;
    }
    else if(does_check == 0){ // 복용 체크 취소
        return -2;
    }
    const doesCheckResult = await mainDao.updateMainCheckCancel(doesCheckIdx); // 복용 체크 취소 0
    const myDoesResult = await mainDao.updateMainMyDoesCancel(preMedicineIdx); // 내가 복용한 일 -1

    if(!doesCheckResult || !myDoesResult){  // DB 갱신 실패
        return -4;
    }

    return 0;
}

/* 처방 약 등록 + 처방전 등록
req.params = token
req.body = pre_medicine_name(약이름), total_does_dt(총복용일)
처방전 = prescriptionIdx, userIdx(token),
prescription_dt
처방약 = preMedicineIdx, prescriptionIdx, 
pre_medicine_name, total_does_dt, my_does_dt(default), total_does_count(하루 복용 횟수)
 */
async function postMainPrescription(userIdx, body) {
    const pre_medicine_name = body.pre_medicine_name; // 약 이름
    const total_does_dt = body.total_does_dt; // 총 복용일
    const total_does_count = body.total_does_count; //  하루 복용 횟수
    const prescription_dt = body.prescription_dt; // 처방날짜 = 조제날짜

    if(!pre_medicine_name|| !total_does_dt || !total_does_count || !prescription_dt){ 
        // 요청 바디가 부족할 경우
        return -1;
    }

    const insertData = {
        "pre_medicine_name": pre_medicine_name,
        "total_does_dt": total_does_dt,
        "total_does_count": total_does_count,
        "prescription_dt": prescription_dt
    }
    
    const prescriptionResult = await mainDao.insertMainPrescription(userIdx, insertData);

    const prescriptionIdx = prescriptionResult.insertId; // insert를 한 PK = Idx를 가져오기
    const medicineResult = await mainDao.insertMainMedicine(prescriptionIdx, insertData);

    if(!prescriptionResult || !medicineResult) { // DB에 갱신하지 못했을 경우
        return -4;
    }

    const preMedicineIdx = medicineResult.insertId; // 처방 약의 idx
    let date = new Date(prescription_dt); // 조제일 = 복용 1일차
    let length = total_does_dt; // 총 복용일

    for(let i = 0; i<length; i++){
        if(i > 0) {
            date.setDate(date.getDate() +1);
        }
        const doesCheckResult = await mainDao.insertMainDoesCheck(preMedicineIdx, date);
        if(!doesCheckResult){   // DB에 갱신하지 못했을 경우
            return -4;
        }
    }
    return 0;
}

/* 버릴약 목록 전체조회 (최신순)
    userIdx, prescriptionIdx, preMedicineIdx, pre_medicine_name, expireIdx, expire_dt, abandon_check
    
    -   주의   -
    1. 조회는 성공했으나 개수가 0개인 경우
*/
async function getMainExpireService(userIdx){
    const expireList = await mainDao.selectMainExpire(userIdx);


    // 2. 조회는 성공했으나 개수가 0개인 경우
    if(expireList.length == 0){
        return -3;
    }
    let expireArray= new Array;

    for (let i = 0 ; i<expireList.length; i++){
        let expire = {
            "userIdx" : "",
            "prescriptionIdx" : "",
            "preMedicineIdx" : "",
            "pre_medicine_name" : "",
            "expireIdx" : "",
            "expire_dt" : Date,
            "abandon_check" : 0
        };

        expire.userIdx = expireList[i].userIdx;
        expire.prescriptionIdx = expireList[i].prescriptionIdx;
        expire.preMedicineIdx = expireList[i].preMedicineIdx;
        expire.pre_medicine_name = expireList[i].pre_medicine_name;
        expire.expireIdx = expireList[i].expireIdx;
        expire.expire_dt = expireList[i].expire_dt;
        expire.abandon_check = expireList[i].abandon_check;
        
        expireArray.push(expire);
    };

    return expireArray;
}

module.exports = {
    getMainDoesCheck,
    putMainDoesCheck,
    putMainDoesCheckCancel,
    postMainPrescription,
    getMainExpireService
}