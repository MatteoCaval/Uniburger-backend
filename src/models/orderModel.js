const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    indirizzo: {
        type: String,
        required: true,
    },
    creationDate: {
        type: Date,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    telephoneNumber: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    paymentType: {
        type: String,
        required: true,
    },
    products: [
        {
            name: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            }
        }
    ],
})

const Order = mongoose.model('Order', orderSchema, 'Orders')

module.exports = Order