const { response, errResponse } = require('../library/response');
const returnCode = require('../library/returnCode');
const { verify } = require('../library/jwt');

const authService = require('../service/authService');

async function postAuthSignin(req, res) {  
}
async function postAuthSignup(req, res) {  
}

module.exports = {
    postAuthSignin,
    postAuthSignup
}
