const Order = require('../models/orderModel')
const User = require('../models/userModel')
const LiveOrdersHandler = require('./liveOrdersManager')
const OrderStatus = require('./orderStatus')
const UserRoleTypes = require('./userRoles')


const getOrderStateIndex = (status) => {
    switch (status) {
        case OrderStatus.PENDING:
            return 0;
        case OrderStatus.IN_DELIVERY:
            return 1;
        case OrderStatus.DELIVERED:
            return 2;
    }
}


module.exports = function (io) {

    const liveOrdersManager = new LiveOrdersHandler(io)
    liveOrdersManager.init()

    const placeOrder = async (req, res) => {
        try {
            const { name, surname, address, city, timeSlot, telephoneNumber, paymentType } = req.body
            const user = req.user

            let total = 0
            user.cart.forEach(product => {
                total += product.price * product.quantity
            });

            if (!user.cart.length) {
                res.status(400).send({ description: 'Order informations non valid' })
            }

            const order = new Order({
                userFullName: `${name} ${surname}`,
                userId: user._id,
                totalPrice: total,
                address,
                city,
                creationDate: Date(),
                date: Date(),
                time: timeSlot,
                telephoneNumber,
                state: OrderStatus.PENDING,
                paymentType,
                products: user.cart.map(product => {
                    return {
                        name: product.name,
                        quantity: product.quantity,
                        price: product.price
                    }
                })
            })
            // da rifare con simil transazione
            await order.save()
            user.cart = []
            await user.save()
            res.status(201).send({ description: 'Order completed' })
            liveOrdersManager.pushNewOrder(order)

        } catch (error) {
            res.status(400).send({ description: error.message })
        }
    }

    const updateOrder = async (req, res) => {
        try {
            const { state, riderId } = req.body
            const orderId = req.params.orderId;

            console.log("Entro in update")
            const order = await Order.findOne({ _id: orderId });
            if (order) {
                const orderStatus = order.state;
                if (getOrderStateIndex(orderStatus) > state) {
                    res.status(400).send({ description: 'Cannot update to a previous state' })
                    return;
                } else {
                    console.log(riderId)
                    console.log(state)

                    if (state === OrderStatus.IN_DELIVERY) {
                        if (!riderId) {
                            res.status(400).send({ description: 'Rider id must be specified when updating order to in delivery' })
                            return
                        }
                        const riderUser = await User.findById(riderId)
                        console.log(riderUser)
                        if (!riderUser) {
                            res.status(400).send({ description: 'No corresponding rider' })
                            return
                        }
                        order.rider = {
                            id: riderUser._id,
                            name: riderUser.name,
                            surname: riderUser.surname
                        }
                    }

                    if (state === OrderStatus.PENDING) {
                        order.rider = null
                    }

                    order.state = state;
                    await order.save();
                    res.status(201).send({ description: 'Order status updated' })
                    liveOrdersManager.orderUpdated(order)
                }
            } else {
                res.status(400).send({ description: 'Order doesn\'t exist' })
                return
            }
        } catch (error) {
            res.status(400).send({ description: error.message })
            console.log(error)
        }

    }

    const getOrders = async (req, res) => {
        try {
            // order state filter
            const filterStates = req.query.state
            const stateFilter = filterStates ? { state: { $in: filterStates } } : {}

            const user = req.user
            if (user.role === UserRoleTypes.RIDER) {
                res.status(403).send({ description: 'Unauthorized' })
                return
            }

            const pageNumber = req.query.page
            const perPage = 5

            const count = await (user.role === UserRoleTypes.ADMIN ? Order.count(stateFilter) : Order.count({ userId: user._id, ...stateFilter }))
            const orders = await (user.role === UserRoleTypes.ADMIN ? Order.find(stateFilter) : Order.find({ userId: user._id, ...stateFilter }))
                .skip(pageNumber > 0 ? ((pageNumber - 1) * perPage) : 0)
                .limit(perPage)

            res.status(200).send({
                page: pageNumber,
                pageCount: Math.ceil(count / perPage),
                orders: orders
            })

        } catch (error) {
            console.log(error.message)
            res.status(400).send({ description: error.message })
        }

    }

    return {
        placeOrder,
        getOrders,
        updateOrder
    }

}


