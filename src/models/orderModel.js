const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
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
        type: String,
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
    rider: {
        id: {
            type: String
        },
        completeName: {
            type: String
        }
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

orderSchema.statics.getOrdersByStates = async (states) => {
    const orders = await Order.find({ state: { $in: states } })
    return orders
}

const Order = mongoose.model('Order', orderSchema, 'Orders')

module.exports = Order