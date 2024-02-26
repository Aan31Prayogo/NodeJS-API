const Pool = require('pg').Pool
const dotenv = require('dotenv')
const logger = require('../service/logger.js');

dotenv.config()

const DB_POSTGRE = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
})


const insertSensorData = async(jsonData) => {
  try{
    await DB_POSTGRE.connect();
    let now_epoch =  Math.floor(Date.now()/1000)

    let query = {
      text: 'INSERT INTO public.node_data (node_id, water_temperature, air_temperature, air_humidity, firmware_version, ip, last_update_epoch) VALUES ($1, $2, $3, $4, $5, $6, $7)',      
      values: [
        jsonData.nodeID,
        jsonData.waterTemperature,
        jsonData.airTemperature,
        jsonData.airHumidity,
        jsonData.firmwareVersion,
        jsonData.ip,
        now_epoch
      ],
    };
    logger.Info("Query insert  ", JSON.stringify(query))


    var result = await DB_POSTGRE.query(query)
    logger.Info("Data insert succesfully ", result.rowCount)
  }
  catch(err){
    logger.Error("Error insertSensorData ", err)
    throw err
  }
  finally{
    await DB_POSTGRE.release();
  }
}

module.exports = {
  insertSensorData
}