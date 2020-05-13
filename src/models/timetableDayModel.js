const mongoose = require('mongoose')

const timetableSchema  = mongoose.Schema({
    day: {
        type: String,
        required: true
    },
    launchTimeStart: {
        type: Date,
    },
    launchTimeEnd: {
        type: Date,
    },
    dinnerTimeStart: {
        type: Date,
    },
    dinnerTimeStart: {
        type: Date,
    },

})
const TimetableDay = mongoose.model('TimetableDay', timetableSchema, 'Timetable')

module.exports = TimetableDay
