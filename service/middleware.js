const dotenv = require('dotenv');
const logger = require('./logger.js');
dotenv.config()

const validatorAPIKEY = (req,res,next) => {
    console.log("req : ", req)
    let response = {}
    if (req.query.api_key === process.env.API_KEY) {
        next()
    }
    else{
        logger.Info('INVALID api key ', req.query.api_key)
        response['isSucces'] = false
        response['message'] = 'Unauthorized'
        res.statusCode=401
        res.json(response)
    }
}


module.exports = {
    validatorAPIKEY
}