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
            token: user.token,
            role: user.role,
            surname: user.surname
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

exports.signup = (role) => {
    console.log()
    return async (req, res) => {
        try {
            if (role === 'rider' && !req.user) {
                res.status(403).send({ description: 'cannot crete user, permission denied' })
            }

            const { email, password, name, surname } = req.body

            const registeredUser = await User.findOne({ email })
            if (registeredUser) {
                res.status(400).send({ description: 'User already present' })
                return
            }

            const hashedPassword = await bcrypt.hash(password, 8)
            const user = new User({
                email,
                password: hashedPassword,
                name,
                surname,
                role
            })
            await user.save()
            const token = await user.generateAuthToken()
            res.status(201).send({ email, token, role, name, surname })

        } catch (error) {
            console.log(error)
            res.status(400).send({ description: error.message })
        }
    }
}

exports.delete_user = async (req, res) => {
    try {
        const user = req.user
        const userId = req.params.userId
        if (user && userId) {
            await User.deleteOne({ _id: userId })
            res.status(200).send({ description: 'User deleted' })
        } else {
            res.status(400).send({ description: 'Error deleting user' })
        }

    } catch (e) {
        res.status(400).send({ description: 'Error deleting user' })
    }
}




