const returnDao = require('../dao/returnDao');
const request = require('request');
const converter = require('xml-js');

async function insertPharmacy(body){

    if(!(body.longitude>126 && body.longitude<130) || !(body.latitude>33 && body.latitude<39)){
        return -1;
        }

    var DataList = [];
    var url = 'http://apis.data.go.kr/B551182/pharmacyInfoService/getParmacyBasisList';
    var key = 'PLo6jiIN0HeZlR%2F6VMg54t7W9zrN9GtRRXySPLeOzjCi5B7ukNvc9IS%2FdpASIXhd8ZHXkYTMMntVEUDqMgdWXg%3D%3D';

    var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + key; /* Service Key*/
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('20'); /* */
    queryParams += '&' + encodeURIComponent('xPos') + '=' + encodeURIComponent(`${body.longitude}`); /* */
    queryParams += '&' + encodeURIComponent('yPos') + '=' + encodeURIComponent(`${body.latitude}`); /* */
    queryParams += '&' + encodeURIComponent('radius') + '=' + encodeURIComponent('2000'); /* */



    request({
        url: url + queryParams,
        method: 'GET'
    },  function (err, res, body) {
        
        if(err) throw err;

        var jsonbody = converter.xml2json(body, {compact: true ,spaces:4});
        var jbody = JSON.parse(jsonbody);

        for(var i =0; i<10; i++){
            var listData = {
                "name" : "",
                "phone_number" : "",
                "address" : "",
                "longitude" : 0.0,
                "latitude" : 0.0
            };
        
            listData.name = jbody.response.body.items.item[i].yadmNm._text;
            listData.phone_number = jbody.response.body.items.item[i].telno._text;
            listData.address = jbody.response.body.items.item[i].addr._text;
            listData.longitude = jbody.response.body.items.item[i].XPos._text;
            listData.latitude = jbody.response.body.items.item[i].YPos._text;

            returnDao.insertPharmacydao(listData);
    }
            
    });

    return 1;
}

async function selectPharmacy(req){
    const selectData = await returnDao.selectPharmacydao(req.query.longitude, req.query.latitude);
    var dataList = [];

    for (var i=0; i< selectData.length; i++){
    const allData = {
        "idx" : 0,
        "name" : "",
        "address" : "",
        "number" : "",
        "longitude" : 0.0,
        "latitude" : 0.0
    }

    allData.idx = selectData[i].pharmacyIdx;
    allData.name = selectData[i].pharmacy_name;
    allData.address = selectData[i].pharmacy_address;
    allData.number = selectData[i].pharmacy_number;
    allData.longitude = selectData[i].pharmacy_longitude;
    allData.latitude = selectData[i].pharmacy_latitude;

    dataList[i] = allData;

    }
    return dataList;
}


module.exports = {
    insertPharmacy,
    selectPharmacy
}