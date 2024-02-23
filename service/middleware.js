const dotenv = require('dotenv');
dotenv.config()

const validatorAPIKEY = (req,res,next) => {
    let response = {}
    if (req.query.api_key === process.env.API_KEY) {
        next()
    }
    else{
        response['isSucces'] = false
        response['message'] = 'Unauthorized'
        res.statusCode=401
        res.json(response)
    }
}


module.exports = {
    validatorAPIKEY
}