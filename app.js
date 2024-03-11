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
app.get('/firmware/httpUpdateNew.bin', middleWare.validatorAPIKEY , route.getLastFirmware);
app.post("/sensor/storeInfluxData", middleWare.validatorHeader, route.insertInflux);
app.post("/sensor/insertNodeData", middleWare.validatorHeader, route.insertPostgre);

app.listen(port, () => {
	console.log(`Server is listening on ${port}`);
});