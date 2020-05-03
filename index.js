const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use((req,res) => {
    res.status(404).send({ description: req.originalUrl + ' not found' });
})

app.listen(3000, () => {
    console.log('listening on port 3000');
});
