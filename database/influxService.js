const dotenv = require('dotenv')
const { InfluxDB, Point } = require('@influxdata/influxdb-client')
const logger = require('../service/logger.js');

repl.repl.ignoreUndefined=true
const token = process.env.INFLUXDB_TOKEN
const url = process.env.INFLUXDB_URL
dotenv.config()

const influxDB = new InfluxDB({ url, token })
const writeApi = influxDB.getWriteApi(org, "prayogo")


function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

const writeDataSensor= () =>{
    try{
        logger.Info("Received param influxWritePoint ", param)
        console.log("Received param influxWritePoint ", param)

        let point1 = new Point('dummysensor')
        .tag('roomName', 'kitchen')
        .intField('temperature', getRndInteger(24,30))
        
        writeApi.writePoint(point1)

        writeApi.close().then(()=>{
            console.log('WRITE FINISHED')
        })
    }
    catch(err){
        logger.Error("ERROR param influxWritePoint ", err.message)
    }
}


module.exports = {
    writeDataSensor
}