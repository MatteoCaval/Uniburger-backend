const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const config = require('../config')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, config.TOKEN_SECRET)
        const user = await User.findOne({ _id: data._id, 'tokens.token': token })
        if (!user) {
            throw new Error('No corresponding user')
        }
        req.user = user
        req.token = token
        next()
    } catch (error) {
        console.log(error)
        res.status(401).send({ description: 'Authenitication error' })
    }
}

module.exports = auth