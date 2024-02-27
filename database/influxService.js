const dotenv = require('dotenv')
const { InfluxDB, Point } = require('@influxdata/influxdb-client')
const logger = require('../service/logger.js');
const { json } = require('body-parser');

const token = process.env.INFLUXDB_TOKEN
const url = process.env.INFLUXDB_URL
const org = process.env.INFLUXDB_ORG
dotenv.config()

const influxDB = new InfluxDB({ url, token })


function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

const writeDataSensor= (jsonData) =>{
    try{
        let waterTemperature = jsonData.waterTemperature.toFixed(2)
        let airTemperature = jsonData.airTemperature.toFixed(2);
        let airHumidity = jsonData.airHumidity.toFixed(2);

        let writeApi = influxDB.getWriteApi(org, "prayogo")

        logger.Info("Received param influxWritePoint ", jsonData)

        let point1 = new Point('DataSensor')
        .tag('roomName', 'garden')
        .floatField('WaterTemperature', waterTemperature)
        .floatField('AirTemperature', airTemperature)
        .floatField('AirHumidity', airHumidity)


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