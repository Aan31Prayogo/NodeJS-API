const express = require('express');
const app = express()
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv')
const logger = require('./logger.js')

dotenv.config()
const port = process.env.PORT || 8081

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    var result = {}
    result['isSucces'] = true
    result['message'] = 'Hello from server'
    res.statusCode = 200
    res.json(result);

    logger.Info('[Response] from route / ', JSON.stringify(result))
  }
);

let downloadCounter = 1;
app.get('/firmware/httpUpdateNew.bin', (req, res) => {
  var result = {}
  try{
    if (req.query.api_key === process.env.API_KEY){
      const filePath = path.join(__dirname, process.env.FIRMWARE_PATH, "myBlink.ino.bin"); 
      const fileName = "firmware.bin";
      res.download(filePath, fileName, (err)=>{
        if (err) {
          console.log("Problem on download firmware: ", err)
          logger.Error("Problem on download firmware: ", err)
        }else{
          downloadCounter++;
        }
      });
      console.log('Your file has been downloaded '+downloadCounter+' times!')
      logger.Info('Your file has been downloaded '+downloadCounter+' times!')
    }
    else{
      logger.Error('Invali API KEY ' , req.query.api_key)
      result['isSucces'] = false
      result['message'] = "Unauthorized"
      res.statusCode = 401
      res.json(result)
    }
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

app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
  }
);