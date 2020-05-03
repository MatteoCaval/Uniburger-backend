const User = require('../models/userModel')
const bcrypt = require('bcrypt')

// TODO extrarre parte di generazione token e hash password, queste sono solo prove

exports.get_user = async (req, res) => {
    const { name, email } = req.user
    res.status(200).send({ name, email })
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findUserByCredential(email, password)
        user.token = await user.generateAuthToken()
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
        const { name, email, password } = req.body

        const registeredUser = await User.findOne({ email })
        if (registeredUser) {
            res.status(400).send({ description: 'User already present' })
        }

        const hashedPassowrd = await bcrypt.hash(password, 8)
        const user = new User({
            name,
            email,
            password: hashedPassowrd
        })
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ name, email, token })

    } catch (error) {
        console.log(error)
        res.status(400).send({ description: error.message })
    }
}


