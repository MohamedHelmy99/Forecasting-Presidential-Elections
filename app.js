const express = require('express');


const bodyParser = require('body-parser')

const app = express();



const forecastScores = require('./api/forecast_scores');


app.use(bodyParser.urlencoded({ extended : false }))

app.use(bodyParser.json())


app.use('/forecast_scores', forecastScores);


module.exports = app;



