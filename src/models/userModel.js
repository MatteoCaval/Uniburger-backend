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
    cart: {
        total: {
            type: Number
        },
        cartItems: [{
            productId: {
                type: mongoose.ObjectId,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            name: {
                type: String,
                required: true
            },
            image: {
                type: String
            },
            price: {
                type: Number
            }
        }]
    },
    role: {
        type: String,
        required: true,
    }
})

userSchema.methods.addProductToCart = async function (product, quantity) {
    const user = this
    console.log(user.cart.cartItems)

    if (!user.cart.total){
        user.cart.total = 0
    }

    user.cart.total = user.cart.total + product.price * quantity

    const alreadyAddedProduct = await user.cart.cartItems.find(elem => elem.productId.toString() == product._id.toString())
    if (alreadyAddedProduct) {
        alreadyAddedProduct.quantity++
    } else {
        user.cart.cartItems = user.cart.cartItems.concat({
            productId: product._id,
            quantity: quantity,
            name: product.name,
            image: product.image,
            price: product.price
        })
    }
    await user.save()
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