const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    token: {
        type: String,
        // required: true
    }
})

const User = mongoose.model('User', userSchema, 'Users')

module.exports = User