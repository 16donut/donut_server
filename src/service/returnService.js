const returnDao = require('../dao/returnDao');
const request = require('sync-request');
const converter = require('xml-js');

//약국 조회(최대20개)
async function selectPharmacy(req){

    //param이 제대로 안들어 왔을때
    if(!req.query.longitude || !req.query.latitude){
        return -1
    }

    var DataList = [];
    var url = 'http://apis.data.go.kr/B551182/pharmacyInfoService/getParmacyBasisList';
    var key = 'PLo6jiIN0HeZlR%2F6VMg54t7W9zrN9GtRRXySPLeOzjCi5B7ukNvc9IS%2FdpASIXhd8ZHXkYTMMntVEUDqMgdWXg%3D%3D';

    var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + key; /* Service Key*/
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('20'); /* */
    queryParams += '&' + encodeURIComponent('xPos') + '=' + encodeURIComponent(`${req.query.longitude}`); /* */
    queryParams += '&' + encodeURIComponent('yPos') + '=' + encodeURIComponent(`${req.query.latitude}`); /* */
    queryParams += '&' + encodeURIComponent('radius') + '=' + encodeURIComponent('2000'); /* */


    res = await request('GET', url + queryParams);

    apibody = res.getBody();

    var jsonbody = converter.xml2json(apibody, {compact: true ,spaces:4});
    var jbody = JSON.parse(jsonbody);

    total = jbody.response.body.totalCount._text;

    if(total > 20)
        for(var i =0; i<20; i++){
            var listData = {
                "pharmacy_name" : "",
                "pharmacy_number" : "",
                "pharmacy_address" : "",
                "pharmacy_longitude" : 0.0,
                "pharmacy_latitude" : 0.0
            };
        
            listData.pharmacy_name = jbody.response.body.items.item[i].yadmNm._text;
            listData.pharmacy_number = jbody.response.body.items.item[i].telno._text;
            listData.pharmacy_address = jbody.response.body.items.item[i].addr._text;
            listData.pharmacy_longitude = jbody.response.body.items.item[i].XPos._text;
            listData.pharmacy_latitude = jbody.response.body.items.item[i].YPos._text;

            DataList[i] = listData;
    }else{
        for(var i =0; i<total; i++){
            var listData = {
                "pharmacy_name" : "",
                "pharmacy_number" : "",
                "pharmacy_address" : "",
                "pharmacy_longitude" : 0.0,
                "pharmacy_latitude" : 0.0
            };
        
            listData.pharmacy_name = jbody.response.body.items.item[i].yadmNm._text;
            listData.pharmacy_number = jbody.response.body.items.item[i].telno._text;
            listData.pharmacy_address = jbody.response.body.items.item[i].addr._text;
            listData.pharmacy_longitude = jbody.response.body.items.item[i].XPos._text;
            listData.pharmacy_latitude = jbody.response.body.items.item[i].YPos._text;

            DataList[i] = listData;
    }
}

    //검색된 약국이 없을때
    if(DataList.length == 0){
        return -2;
    }
    
    return DataList;
}



/* 버릴약 목록 전체조회 (최신순)
    userIdx, prescriptionIdx, preMedicineIdx, pre_medicine_name, expireIdx, expire_dt, abandon_check
    
    -   주의   -
    1. 조회는 성공했으나 개수가 0개인 경우
*/
async function getReturnExpireService(userIdx){
    const expireList = await returnDao.selectReturnExpiredao(userIdx);


    // 1. 조회는 성공했으나 개수가 0개인 경우
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

/* 버릴약 목록 삭제 (회수완료)
    회수완료: 1 update

        -   Error   -
    1. 요청 바디가 없을 경우
    2. user와 expireIdx가 일치하지 않을 경우
    3. update에 실패했을 경우

*/
async function putReturnExpireService(body, userIdx){
    const expireIdx = body.expireIdx;

    // 1. 요청 바디가 없을 경우
    if(!expireIdx){
        return -1;
    }

    const expireCheckUser = await returnDao.checkExpireUserdao(userIdx,expireIdx);
    const expirdCheck = await returnDao.selectExpireCheckdao(expireIdx);
    
    // 2. user와 expireIdx가 일치하지 않을 경우
    if(expireCheckUser < 1){
        return -2;
    }
    // 3. update에 실패했을 경우
    else if(expirdCheck.length == 1){
        return -3;
    }else{
        const expireCheckResult = await returnDao.updateExpireCheckdao(expireIdx);
        return 0;
    }
}


module.exports = {
    selectPharmacy,
    getReturnExpireService,
    putReturnExpireService
}