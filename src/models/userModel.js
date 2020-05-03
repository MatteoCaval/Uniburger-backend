const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const config = require('../config')
const jwt = require('jsonwebtoken')

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
        type: String, // sarebbe meglio array di token
        // required: true
    }
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id }, config.JWT_KEY)
    user.token = token
    await user.save()
    return token
}

userSchema.statics.findUserByCredential = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Invalid credential')
    }
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
        throw new Error('Invalid credential')
    }
    return user
}

const User = mongoose.model('User', userSchema, 'Users')

module.exports = User