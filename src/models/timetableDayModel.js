const mongoose = require('mongoose')

const timetableSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    launchOpen: {
        type: Boolean,
        required: true
    },
    dinnerOpen: {
        type: Boolean,
        required: true
    },
    launch: {
        timeStart: {
            hour: {
                type: Number,
                required: true
            },
            minute: {
                type: Number,
                required: true
            }
        },
        timeEnd: {
            hour: {
                type: Number,
                required: true
            },
            minute: {
                type: Number,
                required: true
            }
        }
    },
    dinner: {
        timeStart: {
            hour: {
                type: Number,
                required: true
            },
            minute: {
                type: Number,
                required: true
            }
        },
        timeEnd: {
            hour: {
                type: Number,
                required: true
            },
            minute: {
                type: Number,
                required: true
            }
        }
    },
})
const TimetableDay = mongoose.model('TimetableDay', timetableSchema, 'Timetable')

module.exports = TimetableDay
