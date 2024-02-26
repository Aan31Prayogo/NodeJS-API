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

    var query = {
      text: 'INSERT INTO public.NodeData (nodeID, waterTemperature, airTemperature, airHumidity, firmwareVersion, ip) VALUES ($1, $2, $3, $4, $5, $6)',
      values: [
        jsonData.nodeID,
        jsonData.waterTemperature,
        jsonData.airTemperature,
        jsonData.airHumidity,
        jsonData.firmwareVersion,
        jsonData.ip,
      ],
    };

    var result = await DB_POSTGRE.query(query)
    logger.Info("Data insert succesfully ", result.rowCount)

  }
  catch(err){
    logger.Error("Error insertSensorData ", err.message)
    throw err
  }
  finally{
    await DB_POSTGRE.end();
  }
}

module.exports = {
  insertSensorData
}