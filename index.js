const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')


mongoose.connect(
    'mongodb://localhost/test', // test nome del database, non della collection
    {
        useNewUrlParser: true,
        useFindAndModify: false
    })

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const userRoutes = require('./src/routes/userRoutes')
userRoutes(app)

app.use((req,res) => {
    res.status(404).send({ description: req.originalUrl + ' not found' });
})

app.listen(3000, () => {
    console.log('listening on port 3000');
});
