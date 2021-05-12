const calendarDao = require('../dao/calendarDao');


//먹은 약 찾기
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

//안 먹은 약 찾기
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


// 버릴 약 찾기
async function selectAbondonMedecine(user_idx){
    let selectData = await calendarDao.selectAbandonMedecine(user_idx);

    let dataList = [];
    //데이터가 없을 경우
    if(selectData.length == 0){
        return -1;
    }

    for(var i = 0 ; i < selectData.length; i++){
        // 이름, 만료일
        var allData = {
            "name" : "",
            "expire_date" : Date,
        }

        allData.name = selectData[i].name;
        allData.expire_date = selectData[i].date;

        dataList.push(allData);
    }

    return dataList;
}
module.exports = {
    selectEatMedcineService,
    selectDontEatMedecineService,
    selectAbondonMedecine
}