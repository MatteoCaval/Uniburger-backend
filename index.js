const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const config = require('./src/config')
const cors = require('cors')


mongoose.connect(
    config.MONGO_URI, // test nome del database, non della collection
    {
        useNewUrlParser: true,
        useFindAndModify: false
    })

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const userRoutes = require('./src/routes/userRoutes')
const authRouter = require('./src/routes/authRoutes')
userRoutes(app)
authRouter(app)

app.use((req,res) => {
    res.status(404).send({ description: req.originalUrl + ' not found' });
})

app.listen(config.LISTEN_PORT, () => {
    console.log(`listening on port ${config.LISTEN_PORT}`);
});
