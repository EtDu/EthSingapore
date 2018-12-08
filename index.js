const express = require('express')
const bodyParser = require('body-parser') 
const fs = require('fs')
const routes = require('express').Router();
const oracle = require('./oracle/oracle')
var port = process.env.port || 8080;

var app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/frontend/dist'))

app.use('/', routes);
oracle.Oracle.newKovanWeb3()
oracle.Oracle.newExtDevWeb3()

routes.get('/getData/:coinAddr/:ownerAddr/:qty', async function (req, res) {
    const coinAddress = req.params.coinAddr
    const ownerAddress = req.params.ownerAddr
    const amount = req.params.qty
    await oracle.Oracle.calculate(ownerAddress, coinAddress, amount)

    const rate = await oracle.Oracle.getRate()
    const interval = await oracle.Oracle.getInterval()
    const dividends = await oracle.Oracle.getDividends(ownerAddress)

    res.status(200).send({
        rate: rate,
        interval: interval,
        dividends: dividends
    })

})

app.listen(port, console.log('application is running on' + port));