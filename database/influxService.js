const dotenv = require('dotenv')
const { InfluxDB, Point } = require('@influxdata/influxdb-client')
const logger = require('../service/logger.js');

const token = process.env.INFLUXDB_TOKEN
const url = process.env.INFLUXDB_URL
const org = process.env.INFLUXDB_ORG
dotenv.config()

const influxDB = new InfluxDB({ url, token })


function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

const writeDataSensor= () =>{
    try{
        let writeApi = influxDB.getWriteApi(org, "prayogo")

        // logger.Info("Received param influxWritePoint ", param)
        // console.log("Received param influxWritePoint ", param)

        let point1 = new Point('dummysensor')
        .tag('roomName', 'kitchen')
        .intField('temperature', getRndInteger(24,30))
        .intField('humidity', getRndInteger(70,100))

        
        writeApi.writePoint(point1)
        writeApi.close()
        return true
    }
    catch(err){
        logger.Error("ERROR param influxWritePoint ", err.message)
        return false
    }
}


module.exports = {
    writeDataSensor
}