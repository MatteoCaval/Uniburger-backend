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
                required: function() {return this.launchOpen === true}
            },
            minute: {
                type: Number,
                required: function() {return this.launchOpen === true}
            }
        },
        timeEnd: {
            hour: {
                type: Number,
                required: function() {return this.launchOpen === true}
            },
            minute: {
                type: Number,
                required: function() {return this.launchOpen === true}
            }
        }
    },
    dinner: {
        timeStart: {
            hour: {
                type: Number,
                required: function() {return this.dinnerOpen === true}
            },
            minute: {
                type: Number,
                required: function() {return this.dinnerOpen === true}
            }
        },
        timeEnd: {
            hour: {
                type: Number,
                required: function() {return this.dinnerOpen === true}
            },
            minute: {
                type: Number,
                required: function() {return this.dinnerOpen === true}
            }
        }
    },
})
const TimetableDay = mongoose.model('TimetableDay', timetableSchema, 'Timetable')

module.exports = TimetableDay
