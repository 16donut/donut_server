const mysql = require('promise-mysql');
const { mySqlConfig } = require('../../config/dbConfig');
// async await 문법을 사용하기 위해 promise-mysql 사용

let mysqlPool;

async function getMysqlPool() { 
    if (!mysqlPool) {
        mysqlPool = await mysql.createPool(mySqlConfig);
        return mysqlPool;
    }
    return mysqlPool;
}

async function query(...args) {  
    const queryText = args[0];
    const data = args[1]; // array

    await getMysqlPool();

    const connection = await mysqlPool.getConnection();
    const result = await connection.query(queryText, data) || null;

    connection.release();

    return result;
}

async function transaction(...args) {
    await getMysqlPool();

    const result = true;
    const connection = await mysqlPool.getConnection();

    try {
        await connection.beginTransaction();

        await args[0](connection);
        await connection.commit();
    } catch (error) {
        console.log(error);
        await connection.rollback();
        result = undefined;
    } finally {
        connection.release();
        return result;
    }
}

module.exports = {
    query,
    transaction,
};