const calendarDao = require('../dao/calendarDao');
const { all } = require('../routes/return');

function formatDate(date) { 
    var d = new Date(date), month = '' + (d.getMonth() + 1),  day = '' + d.getDate(),  year = d.getFullYear(); 
    if (month.length < 2) 
        month = '0' + month; 
    if (day.length < 2) 
        day = '0' + day; 
    return [year, month, day].join('-'); }



//먹은 약 찾기
async function selectEatMedicineService(user_idx){
    var selectData = await calendarDao.selectEatMedicine(user_idx);
    var dataList = [];
    //데이터가 없을때
    if(selectData.length == 0){
        return -1;
    }

    for(var i = 0 ; i < selectData.length; i++){
        var allData = {
            "preMedicineIdx" : 0,
            "pre_medicine_name" : "",
            "does_dt" : Date
        }

        allData.preMedicineIdx = selectData[i].idx;
        allData.pre_medicine_name = selectData[i].name;
        allData.does_dt = formatDate(selectData[i].date);

        dataList.push(allData);
    }

    return dataList;

}

//안 먹은 약 찾기
async function selectNoEatMedicineService(user_idx){
    var selectData = await calendarDao.selectNoEatMedicine(user_idx);
    var dataList = [];
    //데이터가 없을 경우
    if(selectData.length == 0){
        return -1;
    }

    for(var i = 0 ; i < selectData.length; i++){
        // 이름, 조제일, 가용 일수
        var allData = {
            "preMedicineIdx" : 0,
            "pre_medicine_name" : "",
            "prescription_dt" : Date,
            "medicine_max_dt" : 0
        }

        allData.preMedicineIdx = selectData[i].idx;
        allData.pre_medicine_name = selectData[i].name;
        allData.prescription_dt = formatDate(selectData[i].date);
        allData.medicine_max_dt = selectData[i].max_date

        dataList.push(allData);
    }

    return dataList;

}


// 버릴 약 찾기
async function selectAbandonMedicine(user_idx){
    var selectData = await calendarDao.selectAbandonMedicine(user_idx);
    var dataList = [];

    //데이터가 없을 경우
    if(selectData.length == 0){
        return -1;
    }

    for(var i = 0 ; i < selectData.length; i++){
        // 이름, 만료일
        var allData = {
            "preMedicineIdx" : 0,
            "pre_medicine_name" : "",
            "expire_dt" : Date,
        }
        
        allData.preMedicineIdx = selectData[i].idx;
        allData.pre_medicine_name = selectData[i].name;
        allData.expire_dt = formatDate(selectData[i].date);

        dataList.push(allData);
    }

    return dataList;
}
module.exports = {
    selectEatMedicineService: selectEatMedicineService,
    selectNoEatMedicineService: selectNoEatMedicineService,
    selectAbandonMedicine: selectAbandonMedicine
}