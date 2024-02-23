const dotenv = require('dotenv');
const logger = require('./logger.js');
dotenv.config()

const validatorAPIKEY = (req,res,next) => {
    let response = {}
    if (req.query.api_key === process.env.API_KEY) {
        next()
    }
    else{
        logger.Info('INVALID api key ', JSON.stringify(req))
        response['isSucces'] = false
        response['message'] = 'Unauthorized'
        res.statusCode=401
        res.json(response)
    }
}


module.exports = {
    validatorAPIKEY
}