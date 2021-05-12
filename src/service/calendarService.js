const calendarDao = require('../dao/calendarDao');

async function selectEatMedcineService(user_idx){
    let selectData = await calendarDao.selectEatMedecine(user_idx);
    let dataList = [];
    //데이터가 없을때
    if(selectData.length == 0){
        return -1;
    }

    for(var i = 0 ; i < selectData.length; i++){
        var allData = {
            "name" : "",
            "eat_date" : Date
        }

        allData.name = selectData[i].name;
        allData.eat_date = selectData[i].date;

        dataList.push(allData);
    }

    return dataList;

}

async function selectDontEatMedecineService(user_idx){
    let selectData = await calendarDao.selectDontEatMedecine(user_idx);
    let dataList = [];
    //데이터가 없을 경우
    if(selectData.length == 0){
        return -1;
    }

    for(var i = 0 ; i < selectData.length; i++){
        // 이름, 조제일, 가용 일수
        var allData = {
            "name" : "",
            "make_date" : Date,
            "late_date" : 0
        }

        allData.name = selectData[i].name;
        allData.make_date = selectData[i].date;
        allData.late_date = selectData[i].max_date

        dataList.push(allData);
    }

    return dataList;

}

async function selectAbondonMedecine(user_idx){
    let selectData = `
    SELECT 
    `
}
module.exports = {
    selectEatMedcineService,
    selectDontEatMedecineService
}