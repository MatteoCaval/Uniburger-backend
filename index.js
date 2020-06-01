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
        useFindAndModify: false,
        useUnifiedTopology: true
    })

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const userRoutes = require('./src/routes/userRoutes')
const authRoutes = require('./src/routes/authRoutes')
const catalogRoutes = require('./src/routes/catalogRoutes')
const ordersRoutes = require('./src/routes/ordersRoutes')
const timetableRoutes = require('./src/routes/timetableRoutes')
const ridersRoutes = require('./src/routes/ridersRoutes')

userRoutes(app)
authRoutes(app)
catalogRoutes(app)
ordersRoutes(app)
timetableRoutes(app)
ridersRoutes(app)


app.use((req, res) => {
    res.status(404).send({ description: req.originalUrl + ' not found' });
})

const server = app.listen(config.LISTEN_PORT, () => {
    console.log(`listening on port ${config.LISTEN_PORT}`);
});


const io = require('socket.io').listen(server);

io.on('connection', socket => {
    console.log(`user connected ${socket}`)
    io.emit('prova', 'benvenuto')

    socket.on('disconnect', () => console.log('user disconnected'))
})