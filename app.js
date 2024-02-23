const express = require('express');
const app = express()
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const logger = require('./service/logger.js');
const firmwareUtils = require('./service/firmwareUtils.js');
const middleWare = require('./service/middleware.js');

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

app.post("/sensor/storeData", (req,res)=> {


});

app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
  }
);