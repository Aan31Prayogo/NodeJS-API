const express = require('express');
const app = express()
const bodyParser = require('body-parser');
const port = 8081

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello, Express!');
  }
);

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
  }
);