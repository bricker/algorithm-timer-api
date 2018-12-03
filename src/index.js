const express = require('express');
const bodyParser = require('body-parser');
const runner = require('./runner.js');

const app = express();
const port = 3001;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post('/run', runner);
app.listen(port, () => { console.log(`Listening on port ${port}`) });

module.exports = app;
