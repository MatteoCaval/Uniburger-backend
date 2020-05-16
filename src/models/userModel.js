const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const config = require('../config')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    surname: {
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
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    cart: [{

        productId: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        }
    }],
    role: {
        type: String,
        required: true,
    }
})

userSchema.methods.addProductToCart = async function (productId) {
    const user = this
    const alreadyAddedProduct = await user.cart.find(elem => elem.productId === productId)
    if (alreadyAddedProduct) {
        alreadyAddedProduct.quantity++
    } else {
        user.cart = user.cart.concat({ productId, quantity: 1 })
    }
    await user.save()
    console.log(user.cart)
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id }, config.TOKEN_SECRET)

    user.tokens = user.tokens.concat({ token })
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