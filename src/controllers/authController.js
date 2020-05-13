const User = require('../models/userModel')
const bcrypt = require('bcryptjs')

// TODO extrarre parte di generazione token e hash password, queste sono solo prove
exports.signin = async (req, res) => {
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

exports.logout = async (req, res) => {
    try {
        // non mi convince, forse meglio fare diversamente
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.status(200).send('logout successful')
    } catch (error) {
        res.status(400).send({ description: 'logout error' })
    }
}

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body

        const registeredUser = await User.findOne({ email })
        if (registeredUser) {
            res.status(400).send({ description: 'User already present' })
        }

        const hashedPassword = await bcrypt.hash(password, 8)
        const user = new User({
            name,
            email,
            password: hashedPassword
        })
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ name, email, token })

    } catch (error) {
        console.log(error)
        res.status(400).send({ description: error.message })
    }
}



