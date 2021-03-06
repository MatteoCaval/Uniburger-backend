const Order = require('../models/orderModel')
const User = require('../models/userModel')
const LiveOrdersHandler = require('./liveOrdersManager')
const OrderState = require('../common/orderState')
const UserRoleTypes = require('./../common/userRoles')


const getOrderStateIndex = (state) => {
    switch (state) {
        case OrderState.PENDING:
            return 0;
        case OrderState.IN_DELIVERY:
            return 1;
        case OrderState.DELIVERED:
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
                return res.status(400).send({ description: 'Order informations not valid' })
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
                state: OrderState.PENDING,
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
            return res.status(400).send({ description: error.message })
        }
    }

    const updateOrder = async (req, res) => {
        try {
            const { state, riderId } = req.body
            const orderId = req.params.orderId;

            const user = req.user
            if (user.role === UserRoleTypes.CONSUMER) {
                res.status(403).send({ description: 'Unauthorized' })
                return
            }

            // used to
            let riderIdToNotify = null

            const order = await Order.findOne({ _id: orderId });
            if (order) {
                const orderState = order.state;
                if (getOrderStateIndex(orderState) > state) {
                    res.status(400).send({ description: 'Cannot update to a previous state' })
                    return;
                } else {
                    if (state === OrderState.IN_DELIVERY) {
                        if (user.role === UserRoleTypes.RIDER) {
                            res.status(403).send({ description: 'Unauthorized' })
                            return
                        }

                        if (!riderId) {
                            res.status(400).send({ description: 'Rider id must be specified when updating order to in_delivery' })
                            return
                        }
                        const riderUser = await User.findById(riderId)
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

                    if (order.rider) {
                        riderIdToNotify = order.rider.id
                    }

                    if (state === OrderState.PENDING) {
                        order.rider = null
                    }

                    order.state = state;
                    await order.save();
                    res.status(201).send({ description: 'Order state updated' })
                    liveOrdersManager.notifyOrderUpdateToAdmins(order)
                    if (riderIdToNotify) {
                        liveOrdersManager.notifyOrderUpdateToRider(order, riderIdToNotify)
                    }
                }
            } else {
                res.status(400).send({ description: 'Order doesn\'t exist' })
                return
            }
        } catch (error) {
            console.log(error.message)
            res.status(400).send({ description: error.message })

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
            const orders = await (user.role === UserRoleTypes.ADMIN ? Order.find(stateFilter).sort({date: 'desc'}) : Order.find({ userId: user._id, ...stateFilter }).sort({date: 'desc'}))
                .skip(pageNumber > 0 ? ((pageNumber - 1) * perPage) : 0)
                .limit(perPage)

            res.status(200).send({
                currentPage: pageNumber,
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


