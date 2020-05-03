const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const config = require('../config')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, config.TOKEN_SECRET)
        console.log(data)
        const user = await User.findOne({ _id: data._id, 'tokens.token': token })
        if (!user) {
            throw new Error('No corresponding user')
        }
        req.user = user
        req.token = token
        next()
    } catch (error) {
        res.status(401).send({ description: error.message })
    }
}

module.exports = auth