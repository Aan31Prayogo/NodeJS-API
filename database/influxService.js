const dotenv = require('dotenv')
const { InfluxDB, Point } = require('@influxdata/influxdb-client')
const logger = require('../service/logger.js');
dotenv.config()

const token = process.env.INFLUXDB_TOKEN
const url = process.env.INFLUXDB_URL
const org = process.env.INFLUXDB_ORG

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
        return {
            isSuccess : true,
            message : 'Succes Insert influxDB Data'
        }
    }
    catch(err){
        logger.Error("ERROR param influxWritePoint ", err.message)
        return {
            isSuccess : false,
            message : err.message
        }    
    }
}

const writeTemperatureLogger = (jsondata) => {
    try{
        let contactTemperature = jsondata.tempDS18b20.toFixed(2)
        let airTemperature = jsondata.tempDHT22.toFixed(2);
        let airHumidity = jsondata.humDHT22.toFixed(2);

        let writeApi = influxDB.getWriteApi(org, "prayogo")

        logger.Info("Received param influxWritePoint ", jsondata)

        let point1 = new Point('DataSensor')
        .tag('deviceName', 'TemperatureLogger')
        .floatField('ContactTemperature', contactTemperature)
        .floatField('AirTemperature', airTemperature)
        .floatField('AirHumidity', airHumidity)


        writeApi.writePoint(point1)
        writeApi.close()
        return {
            isSuccess : true,
            message : 'Succes write writeTemperatureLogger Data'
        }
    }
    catch(err){
        logger.Error("ERROR param writeTemperatureLogger ", err.message)
        return {
            isSuccess : false,
            message : err.message
        }    
    }

}

module.exports = {
    writeDataSensor,
    writeTemperatureLogger
}