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
            "medicine_idx" : 0,
            "name" : "",
            "eat_date" : Date
        }

        allData.medicine_idx = selectData[i].idx;
        allData.name = selectData[i].name;
        allData.eat_date = formatDate(selectData[i].date);

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
            "medicine_idx" : 0,
            "name" : "",
            "make_date" : Date,
            "late_date" : 0
        }

        allData.medicine_idx = selectData[i].idx;
        allData.name = selectData[i].name;
        allData.make_date = formatDate(selectData[i].date);
        allData.late_date = selectData[i].max_date

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
        console.log('들어옴');
        return -1;
    }

    for(var i = 0 ; i < selectData.length; i++){
        // 이름, 만료일
        var allData = {
            "medicine_idx" : 0,
            "name" : "",
            "expire_date" : Date,
        }
        
        allData.medicine_idx = selectData[i].idx;
        allData.name = selectData[i].name;
        allData.expire_date = formatDate(selectData[i].date);

        dataList.push(allData);
    }

    return dataList;
}
module.exports = {
    selectEatMedicineService: selectEatMedicineService,
    selectNoEatMedicineService: selectNoEatMedicineService,
    selectAbandonMedicine: selectAbandonMedicine
}