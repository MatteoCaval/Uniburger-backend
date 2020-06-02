const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const config = require('../config')
const Order = require('../models/orderModel')
const OrderStatus = require('./orderStatus')

module.exports = class LiveOrdersHandler {
    constructor(io) {
        this.io = io
        this.connectedAdmins = []
        this.connectedRiders = []
    }

    pushNewOrder(order) {
        this.connectedAdmins.forEach(admin => {
            this.io.to(admin.id).emit('newOrder', order)
        })
    }

    orderUpdated(order) {
        this.connectedAdmins.forEach(admin => {
            this.io.to(admin.id).emit('orderUpdated', order)
        })
    }


    pushNonCompetedOrders() {
        Order.getOrdersByStates([OrderStatus.PENDING, OrderStatus.IN_DELIVERY])
            .then(
                result => {
                    this.connectedAdmins.forEach(admin => {
                        this.io.to(admin.id).emit('orders', result)
                    })

                }
            ).catch(e => console.log(e.message))
    }

    init() {
        this.io.on('connection', async socket => {

            const token = socket.request._query['token']
            console.log(token)
            const data = jwt.verify(token, config.TOKEN_SECRET)
            const user = await User.findOne({ _id: data._id, 'tokens.token': token })
            if (!user) {
                throw new Error('No corresponding user')
            }
            console.log(user.role)

            this.connectedAdmins = [...this.connectedAdmins, socket]
            console.log(`user connected ${this.connectedAdmins.length}`)

            this.pushNonCompetedOrders()


            socket.on('disconnect', () => {
                this.connectedAdmins = this.connectedAdmins.filter(admin => admin.id !== socket.id)
                console.log(`user connected ${this.connectedAdmins.length}`)
            })

        })
    }

}
