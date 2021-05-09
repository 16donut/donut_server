const testDao = require('../dao/testDao');

async function getTestEx() {
    const selectTestResult = await TestDao.selectTestList();  // 디비에서 받아온 데이터들을 변수에 저장

/*    다른예시 
    const allData = {
        "userIdx" : 0,
        "matchingState" : 0,
        "randMovie" : []
    }
*/
    const allData = {  // 데이터 구조를 만들고
        "user_idx" : 0, // int type
        "name" : "" // string type
    }

    // 내가 만든 allData에 select로 받아온 데이터를 push
    // 디비에서 받아온 데이터가 여러개일 경우 for문으로 [i]로 받아오기
    // 디비에서 받아온 데이터가 idx, name 같은 하나만 들어오는 경우 [0]에 데이터가 들어온다고 생각하기
    allData.user_idx = selectTestResult[0].user_idx;
    allData.name = selectTestResult[0].name;

    return allData;
}

module.exports = {
    getTestEx
}