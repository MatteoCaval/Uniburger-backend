const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const config = require('./src/config')
const cors = require('cors')
const http = require('http').Server(app);
const io = require('socket.io')(http);

// aspetto 10 sec che il container di mongo sia su
function pausecomp(millis)
{ var date = new Date(); var curDate = null;
 do { curDate = new Date(); } while(curDate-date < millis);
}
pausecomp(10000);


if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(
        config.MONGO_URI, // test nome del database, non della collection
        {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
}

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
ordersRoutes(app, io)
timetableRoutes(app)
ridersRoutes(app)


app.use((req, res) => {
    res.status(404).send({ description: req.originalUrl + ' not found' });
})


module.exports = app

if (process.env.NODE_ENV !== 'test') {
    // open http connection only if not test running
    // jest sets process.env.NODE_ENV to 'test'
    http.listen(config.LISTEN_PORT, () => {
        console.log(`listening on port ${config.LISTEN_PORT}`);
    });
}


