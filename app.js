const express = require('express');
const app = express()
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const logger = require('./service/logger.js');
const firmwareUtils = require('./service/firmwareUtils.js');
const middleWare = require('./service/middleware.js');
const influx = require('./database/influxService.js')
const postgre = require('./database/postgreService.js')

dotenv.config();
const port = process.env.PORT || 8081

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    let result = {}
    result['isSucces'] = true
    result['message'] = 'Hello from server'
    res.statusCode = 200
    res.json(result);

    logger.Info('[Response] from route / ', JSON.stringify(result))
  }
);

app.get('/firmware/httpUpdateNew.bin', middleWare.validatorAPIKEY , (req, res) => {
	let downloadCounter = 1;
	let result = {}

	try{
		const lastFirmware = firmwareUtils.getLastFirmware(process.env.FIRMWARE_PATH)
		logger.Info('Last firmware = ', lastFirmware)

		const filePath = path.join(process.env.FIRMWARE_PATH, lastFirmware); 
		const fileName = "firmware.bin";

		res.download(filePath, fileName, (err)=>{
			if (err) {
				console.log("Problem on download firmware: ", err)
				logger.Error("Problem on download firmware: ", err)

				result['isSucces'] = false;
				result['message'] = err.message;
				res.json(result);
			}else{
				downloadCounter++;
			}
		});
		console.log('Your file has been downloaded '+downloadCounter+' times!')
		logger.Info('Your file has been downloaded '+downloadCounter+' times!')
	}
	catch(err){

		logger.Error("error on download firmware: ", err)
		console.log('error on download firmware: ', err)

		result['isSucces'] = false
		result['message'] = err.message
		res.statusCode = 500
		res.json(result)
	}
})

app.post("/sensor/storeInfluxData", middleWare.validatorHeader, (req,res)=> {
	let result = {}
	try{
		const callbackResult = influx.writeDataSensor(req.body)
		res.statusCode = callbackResult.isSuccess ? 200 : 500;
		result['isSuccess'] = callbackResult.isSuccess;
		result['message'] = callbackResult.message;
	}
	catch(err){
		logger.Error("Failed /sensor/storeInfluxData with error", err.message);
		res.statusCode = 500;
		result['isSuccess'] = false;
		result['message'] = err.message;
	}

	res.setHeader('Content-Type', 'application/json');
	res.json(result)
});


app.post("/sensor/insertNodeData", middleWare.validatorHeader, async (req, res) => {
	let result = {};
	const jsonData = req.body;
	logger.Info("Received jsonData insertSensorData", JSON.stringify(jsonData));

	try {
		const callbackResult = await postgre.insertSensorData(jsonData);
		res.statusCode = callbackResult.isSuccess ? 200 : 500;
		result['isSuccess'] = callbackResult.isSuccess;
		result['message'] = callbackResult.message;
	} catch (err) {
		res.statusCode = 500;
		logger.Error("Failed /sensor/insertNodeData with error", err.message);
		result['isSuccess'] = false;
		result['message'] = err.message;
	}

	res.setHeader('Content-Type', 'application/json');
	res.json(result);
});


app.listen(port, () => {
	console.log(`Server is listening on ${port}`);
});