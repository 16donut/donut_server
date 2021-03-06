const returnDao = require('../dao/returnDao');
const request = require('sync-request');
const converter = require('xml-js');

function formatDate(date) { 
    var d = new Date(date), month = '' + (d.getMonth() + 1),  day = '' + d.getDate(),  year = d.getFullYear(); 
    if (month.length < 2) 
        month = '0' + month; 
    if (day.length < 2) 
        day = '0' + day; 
    return [year, month, day].join('-'); 
}

function apiselect(jbody, total){

    DataList = []
    if(total > 20)
        for(var i =0; i<20; i++){
            var listData = {
                "pharmacy_name" : "",
                "pharmacy_number" : "",
                "pharmacy_address" : "",
                "pharmacy_longitude" : 0.0,
                "pharmacy_latitude" : 0.0
            };
        
            if(jbody.response.body.items.item[i].yadmNm != undefined){
                listData.pharmacy_name = jbody.response.body.items.item[i].yadmNm._text;
            }else{
                listData.pharmacy_name = null;
            }
            if(jbody.response.body.items.item[i].telno != undefined){
                listData.pharmacy_number = jbody.response.body.items.item[i].telno._text;
            }else{
                listData.pharmacy_number = null;
            }
            if(jbody.response.body.items.item[i].addr != undefined){
                listData.pharmacy_address = jbody.response.body.items.item[i].addr._text;
            }else{
                listData.pharmacy_address = null;
            }
            if(jbody.response.body.items.item[i].XPos != undefined){
                listData.pharmacy_longitude = jbody.response.body.items.item[i].XPos._text;
            }else{
                listData.pharmacy_longitude = null;
            }
            if(jbody.response.body.items.item[i].YPos != undefined){
                listData.pharmacy_latitude = jbody.response.body.items.item[i].YPos._text;
            }else{
                listData.pharmacy_latitude = null;
            }

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
            
                if(jbody.response.body.items.item[i].yadmNm != undefined){
                    listData.pharmacy_name = jbody.response.body.items.item[i].yadmNm._text;
                }else{
                    listData.pharmacy_name = null;
                }
                if(jbody.response.body.items.item[i].telno != undefined){
                    listData.pharmacy_number = jbody.response.body.items.item[i].telno._text;
                }else{
                    listData.pharmacy_number = null;
                }
                if(jbody.response.body.items.item[i].addr != undefined){
                    listData.pharmacy_address = jbody.response.body.items.item[i].addr._text;
                }else{
                    listData.pharmacy_address = null;
                }
                if(jbody.response.body.items.item[i].XPos != undefined){
                    listData.pharmacy_longitude = jbody.response.body.items.item[i].XPos._text;
                }else{
                    listData.pharmacy_longitude = null;
                }
                if(jbody.response.body.items.item[i].YPos != undefined){
                    listData.pharmacy_latitude = jbody.response.body.items.item[i].YPos._text;
                }else{
                    listData.pharmacy_latitude = null;
                }

                DataList[i] = listData;
        }
    }

    return DataList
}

//?????? ??????(??????20???)
async function selectPharmacy(req){

    //param??? ????????? ????????? ?????????
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

    if(total > 20){
        DataList = apiselect(jbody, 20);
    }else{
        DataList = apiselect(jbody, total);
    }
    
    //????????? ????????? ?????????
    if(DataList.length == 0){
        return -2;
    }
    
    return DataList;
}





/* ????????? ?????? ???????????? (?????????)
    userIdx, prescriptionIdx, preMedicineIdx, pre_medicine_name, expireIdx, expire_dt, abandon_check
    
    -   ??????   -
    1. ????????? ??????????????? ????????? 0?????? ??????
*/
async function getReturnExpireService(userIdx){
    const expireList = await returnDao.selectReturnExpiredao(userIdx);


    // 1. ????????? ??????????????? ????????? 0?????? ??????
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
        expire.expire_dt = formatDate(expireList[i].expire_dt);
        expire.abandon_check = expireList[i].abandon_check;

        expireArray.push(expire);
    };

    return expireArray;
}

/* ????????? ?????? ?????? (????????????)
    ????????????: 1 update

        -   Error   -
    1. ?????? ????????? ?????? ??????
    2. user??? expireIdx??? ???????????? ?????? ??????
    3. update??? ???????????? ??????

*/
async function putReturnExpireService(body, userIdx){
    const expireIdx = body.expireIdx;

    // 1. ?????? ????????? ?????? ??????
    if(!expireIdx){
        return -1;
    }

    const expireCheckUser = await returnDao.checkExpireUserdao(userIdx,expireIdx);
    const expirdCheck = await returnDao.selectExpireCheckdao(expireIdx);
    
    // 2. user??? expireIdx??? ???????????? ?????? ??????
    if(expireCheckUser < 1){
        return -2;
    }
    // 3. update??? ???????????? ??????
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