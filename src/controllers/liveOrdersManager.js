const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const config = require('../config')
const Order = require('../models/orderModel')
const OrderState = require('../common/orderState')
const UserRoleType = require('./../common/userRoles')

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

    notifyOrderUpdateToAdmins(order) {
        this.connectedAdmins.forEach(adminSockets => {
            adminSockets.emit('orderUpdated', order)
        })
    }

    notifyOrderUpdateToRider(order, riderId) {
        this.connectedRiders
            .filter(riderSocket => riderSocket.riderId == riderId)
            .forEach(riderSocket => {
                riderSocket.emit('orderUpdated', order)
            })
    }

    pushOrdersToRider(socket, riderId) {
        Order.getRiderOrders(riderId)
            .then(orders => {
                socket.emit('orders', orders)
            })
            .catch(e => console.log(e.message))
    }

    pushOrderToAdmin(socket) {
        Order.getOrdersByStates([OrderState.PENDING, OrderState.IN_DELIVERY])
            .then(
                result => {
                    socket.emit('orders', result)
                }
            ).catch(e => console.log(e.message))
    }

    init() {
        this.io.on('connection', async socket => {
            const token = socket.request._query['token']
            const data = jwt.verify(token, config.TOKEN_SECRET)
            const user = await User.findOne({ _id: data._id, 'tokens.token': token })
            const userRole = user.role
            if (!user) {
                throw new Error('No corresponding user')
            }

            if (userRole === UserRoleType.ADMIN) {
                this.connectedAdmins = [...this.connectedAdmins, socket]
                this.pushOrderToAdmin(socket)
            } else if (userRole === UserRoleType.RIDER) {
                socket.riderId = user._id
                this.connectedRiders = [...this.connectedRiders, socket]
                this.pushOrdersToRider(socket, user._id)
            }


            console.log(`admin connected ${this.connectedAdmins.length} - riders ${this.connectedRiders.length}`)


            socket.on('disconnect', () => {
                this.connectedAdmins = this.connectedAdmins.filter(admin => admin.id !== socket.id)
                this.connectedRiders = this.connectedRiders.filter(rider => rider.id !== socket.id)
                console.log(`after disconnect - admin connected ${this.connectedAdmins.length} - riders ${this.connectedRiders.length}`)
            })

        })
    }

}
