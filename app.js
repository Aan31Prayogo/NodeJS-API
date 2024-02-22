const express = require('express');
const app = express()
const bodyParser = require('body-parser');
const LOG = require('node-file-logger')
const path = require('path');
const dotenv = require('dotenv')

const options = {
  folderPath: './logs/',
  dateBasedFileNaming: true,
  fileNamePrefix: 'DailyLogs_',
  fileNameExtension: '.log',    
  dateFormat: 'YYYY_MM_D',
  timeFormat: 'h:mm:ss',
  timeZone : 'Asia/Bangkok'
}

dotenv.config()
const port = 8081
LOG.SetUserOptions(options); 

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    var result = {}
    result['isSucces'] = true
    result['message'] = 'Hello from server'
    res.statusCode = 200
    res.json(result);

    LOG.Info('[Response] from route / ', JSON.stringify(result))
  }
);

let downloadCounter = 1;
app.get('/firmware/httpUpdateNew.bin', (req, res) => {
  var result = {}
  try{
    if (req.query.api_key === process.env.API_KEY){
      res.download(path.join(__dirname, 'firmware/myBlink.bin'), 'myBlink.bin', (err)=>{
        if (err) {
          console.error("Problem on download firmware: ", err)
          LOG.Error("Problem on download firmware: ", err)
        }else{
          downloadCounter++;
        }
      });
      console.log('Your file has been downloaded '+downloadCounter+' times!')
      LOG.Info('Your file has been downloaded '+downloadCounter+' times!')
    }
    else{
      LOG.Error('Invali API KEY ' , req.query.api_key)
      result['isSucces'] = false
      result['message'] = "Unauthorized"
      res.statusCode = 401
      res.json(result)
    }
  }
  catch(err){
    LOG.Error("error on download firmware: ", err)
    console.log('error on download firmware: ', err)

    result['isSucces'] = false
    result['message'] = err,message
    res.statusCode = 500
    res.json(result)
  }
})

app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
  }
);