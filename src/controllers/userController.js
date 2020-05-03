const mongoose = require('mongoose')
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const JWT_KEY = "chiave"

// TODO extrarre parte di generazione token e hash password, queste sono solo prove

exports.get_user = async (req, res) => {

}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            res.status(404).send({ description: 'user not found' })
        }
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            res.status(400).send('invalid user credential')
        }
        const token = jwt.sign({ _id: user._id }, "chiave")
        user.token = token
        await user.save()
        res.send({
            name: user.name,
            email: user.email,
            token: user.token
        })

    } catch (error) {
        res.status(400).send(error.message)
    }
}

exports.create_user = async (req, res) => {
    try {
        console.log(req.body)
        const { name, email, password } = req.body
        const hashedPassowrd = await bcrypt.hash(password, 8)
        const user = new User({
            name,
            email,
            password: hashedPassowrd
        })
        await user.save()
        const token = jwt.sign({ _id: user._id }, JWT_KEY)
        user.token = token
        await user.save()
        res.status(201).send({ name, email, token })

    } catch (error) {
        console.log(error)
        res.status(400).send({ description: error.message })
    }
}
