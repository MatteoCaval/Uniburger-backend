const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const config = require('../config')

const auth = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '')
    const data = jwt.verify(token, config.JWT_KEY)
    try {
        const user = await User.findOne({ _id: data._id, token: token })
        if (!user) {
            throw new Error('No corresponding user')
        }
        req.user = user
        req.token = token
        next()
    } catch (exception) {
        res.status(401).send({ description: 'Not authorized' })
    }
}

module.exports = auth