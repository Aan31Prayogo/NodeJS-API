const dotenv = require('dotenv');
const logger = require('./logger.js');
dotenv.config()

const validatorAPIKEY = (req,res,next) => {
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

const validatorHeader = (req,res,next) => {
    let response = {}
    console.log(req)
    logger.Info('req', req)

    if (req.headers['API_KEY'] === process.env.API_KEY && req.headers['SECRET_KEY'] === process.env.SECRET_KEY) {
        next()
    }
    else{
        logger.Info('INVALID api key ', req.headers['API_KEY'])
        logger.Info('INVALID secret key ', req.headers['API_KEY'])
        response['isSucces'] = false
        response['message'] = 'Unauthorized'
        res.statusCode=401
        res.json(response)
    }
}

module.exports = {
    validatorAPIKEY,
    validatorHeader
}