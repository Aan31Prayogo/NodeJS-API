const express = require('express');
const app = express()
const bodyParser = require('body-parser');
const port = 8081
const LOG = require('node-file-logger')
const options = {
    folderPath: './logs/',
    dateBasedFileNaming: true,
    fileNamePrefix: 'DailyLogs_',
    fileNameExtension: '.log',    
    dateFormat: 'YYYY_MM_D',
    timeFormat: 'h:mm:ss A',
}
   
LOG.SetUserOptions(options); 

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello, from aan prayogo !!');
    LOG.info('[Response] from route / ', res)
  }
);

let downloadCounter = 1;
app.get('/firmware/httpUpdateNew.bin', (req, res) => {
    res.download(path.join(__dirname, 'firmware/myBlink.bin'), 'myBlink.bin', (err)=>{
        if (err) {
          console.error("Problem on download firmware: ", err)
          LOG.error("Problem on download firmware: ", err)
        }else{
          downloadCounter++;
        }
    });
    console.log('Your file has been downloaded '+downloadCounter+' times!')
    LOG.info('Your file has been downloaded '+downloadCounter+' times!')
})

app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
  }
);