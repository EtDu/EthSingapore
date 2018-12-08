const express = require('express')
const bodyParser = require('body-parser') 
const fs = require('fs')
const routes = require('express').Router();
const oracle = require('oracle/oracle').Oracle;

var port = process.env.port || 8080;

var app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/frontend/dist'))

app.use('/', routes);
routes.get('/', function (req, res) {
    oracle.newKovanWeb3()
    oracle.newExtDevWeb3()
    res.render('index')
})

routes.get('/getData/:coinAddr/:ownerAddr/:qty', async function (req, res) {
    const coinAddress = req.params.coinAddr
    const ownerAddress = req.params.ownerAddr
    const amount = req.params.qty
    
    await oracle.calculate(ownerAddress, coinAddress, amount)

    const rate = await oracle.getRate()
    const interval = await oracle.getInterval()
    const dividends = await oracle.getDividends(ownerAddress)

    res.status(200).send({
        rate: rate,
        interval: interval,
        dividends: dividends
    })

})

app.listen(port, console.log('application is running on' + port));