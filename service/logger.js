const LOG = require('node-file-logger')


const options = {
    folderPath: './logs/',
    dateBasedFileNaming: true,
    fileNamePrefix: 'DailyLogs_',
    fileNameExtension: '.log',    
    dateFormat: 'YYYY_MM_D',
    timeFormat: 'h:mm:ss',
    timeZone : 'Asia/Bangkok'
}

LOG.SetUserOptions(options); 
module.exports = LOG;