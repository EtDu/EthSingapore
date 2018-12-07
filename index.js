const express = require('express')
const bodyParser = require('body-parser') 
const fs = require('fs')
const routes = require('express').Router();

var port = process.env.port || 8080;

var app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/src'))

app.use('/', routes);
routes.get('/', function (req, res) {
    res.render('index')
})

app.listen(port, console.log('application is running on' + port));