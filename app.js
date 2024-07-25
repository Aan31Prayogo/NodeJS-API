const express = require('express');
const app = express()
const dotenv = require('dotenv')
const bodyParser = require('body-parser');
const route = require("./routes/routeService.js")
const middleWare = require("./service/middleware.js")

dotenv.config();
const port = process.env.PORT || 8081

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', route.home);
app.get('/firmware/httpUpdateNew.bin', middleWare.validatorAPIKEY , route.getLastFirmware); //OTA updater ESP32
app.post("/sensor/storeInfluxData", middleWare.validatorHeader, route.insertInflux); //NodeREd
app.post("/sensor/insertNodeData", middleWare.validatorHeader, route.insertPostgre); //NodeRed
app.post("/sensor/writeTemperatureLogger", middleWare.validatorHeader, route.writeTemperatureLogger); //Wemos D1 mini, DHT22, DS18B20
app.post("/sensor/writeTemperatureData", middleWare.validatorHeader, route.writeTemperatureData);  //Wemos D1 mini, Relay, DHt22



app.listen(port, () => {
	console.log(`Server is listening on ${port}`);
});