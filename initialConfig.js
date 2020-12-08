const config = require('./src/config')
const mongoose = require('mongoose')
const User = require('./src/models/userModel')
const TimeTableDay = require('./src/models/timetableDayModel')
const bcrypt = require('bcryptjs')

mongoose.connect(
    config.MONGO_URI, // test nome del database, non della collection
    {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })


const createAdmin = async () => {
    try {
        const password = 'admin'
        const hashedPassword = await bcrypt.hash(password, 8)
        const user = new User({
            email: 'admin@uniburger.it',
            password: hashedPassword,
            name: 'admin',
            surname: 'admin',
            role: 'admin'
        })
        await user.save()
    } catch (e) {
        console.log(e)
    }
}

const createTimeTable = async () => {
    try {
        const initialTimeTable = [
            {
                name: 'Monday',
                launchOpen: false,
                dinnerOpen: false
            },
            {
                name: 'Tuesday',
                launchOpen: false,
                dinnerOpen: false
            },
            {
                name: 'Wednesday',
                launchOpen: false,
                dinnerOpen: false
            },
            {
                name: 'Thursday',
                launchOpen: false,
                dinnerOpen: false
            },
            {
                name: 'Friday',
                launchOpen: false,
                dinnerOpen: false
            },
            {
                name: 'Saturday',
                launchOpen: false,
                dinnerOpen: false
            },
            {
                name: 'Sunday',
                launchOpen: false,
                dinnerOpen: false
            }
        ]

        await TimeTableDay.deleteMany({})

        const dayList = initialTimeTable && initialTimeTable.map(day => {
            return new TimeTableDay({
                name: day.name,
                launchOpen: day.launchOpen,
                dinnerOpen: day.dinnerOpen,
                ...(day.launchOpen && { launch: { ...day.launch } }),
                ...(day.dinnerOpen && { dinner: { ...day.dinner } })
            })
        })

        await TimeTableDay.insertMany(dayList)
    } catch (e) {
        console.log(e)
    }

}

createAdmin()
    .then(() => console.log('admin created'))
    .catch(e => console.log(e.message))

createTimeTable()
    .then(() => console.log('timetable created'))
    .catch(e => console.log(e.message))