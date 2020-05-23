const mongoose = require('mongoose')

const timetableSchema = mongoose.Schema({
    day: {
        type: String,
        required: true
    },
    launchTimeStart: {
        hour: {
            type: Number
        },
        minute: {
            type: Number
        }
    },
    launchTimeEnd: {
        hour: {
            type: Number
        },
        minute: {
            type: Number
        }
    },
    dinnerTimeStart: {
        hour: {
            type: Number
        },
        minute: {
            type: Number
        }
    },
    dinnerTimeEnd: {
        hour: {
            type: Number
        },
        minute: {
            type: Number
        }
    }
})
const TimetableDay = mongoose.model('TimetableDay', timetableSchema, 'Timetable')

module.exports = TimetableDay
