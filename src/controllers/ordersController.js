const UserRoleTypes = {
    ADMIN: 'admin',
    CONSUMER: 'consumer',
    RIDER: 'rider'
}

const Order = require('../models/orderModel')

const OrderStatus = {
    PENDING: 'PENDING',
    IN_DELIVERY: 'IN_DELIVERY',
    DELIVERED: 'DELIVERED'
}

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

    let connectedAdmins = []

    const pushNewOrder = (order) => {
        connectedAdmins.forEach(admin => {
            io.to(admin.id).emit('newOrder', order)
        })
    }

    const pushPendingOrders = () => {
        Order.getPendingOrders()
            .then(
                result => {
                    connectedAdmins.forEach(admin => {
                        io.to(admin.id).emit('orders', result)
                    })

                }
            ).catch(e => console.log(e.message))
    }

    io.on('connection', socket => {


        connectedAdmins = [...connectedAdmins, socket]
        console.log(`user connected ${connectedAdmins.length}`)

        pushPendingOrders()


        socket.on('disconnect', () => {
            connectedAdmins = connectedAdmins.filter(admin => admin.id !== socket.id)
            console.log(`user connected ${connectedAdmins.length}`)
        })

    })

    const placeOrder = async (req, res) => {
        try {

            const { name, surname, address, city, timeSlot, telephoneNumber, paymentType } = req.body
            const user = req.user

            let total = 0
            user.cart.forEach(product => {
                total += product.price * product.quantity
            });

            const order = new Order({
                name,
                surname,
                userId: user._id,
                totalPrice: total,
                address,
                city,
                creationDate: Date(),
                date: Date(),
                time: timeSlot,
                telephoneNumber,
                state: 'PENDING',
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
            pushNewOrder(order)

        } catch (error) {
            res.status(400).send({ description: error.message })
        }
    }

    const updateOrder = async (req, res) => {
        try {
            const { order_id, status: state } = req.body;
            const order = await Order.findOne({ _id: order_id });
            if (order) {
                const orderStatus = order.state;
                if (getOrderStateIndex(orderStatus) > state){
                    res.status(400).send({ description: 'Cannot update to a previous state' })
                } else {
                    order.state = state;
                    await order.save();
                    res.status(201).send({ description: 'Order status updated' })
                }
            } else {
                res.status(400).send({ description: 'Order doesn\'t exist'})
            }
        } catch (error) {
            console.log(error)
            res.status(400).send({ description: error.message })
        }
        
    }

    const getOrders = async (req, res) => {
        try {
            const user = req.user
            if (user.role === UserRoleTypes.RIDER) {
                res.status(403).send({ description: 'Unauthorized' })
                return
            }

            const pageNumber = req.query.page
            const perPage = 5

            const count = await (user.role === UserRoleTypes.ADMIN ? Order.count() : Order.count({ userId: user._id }))
            const orders = await (user.role === UserRoleTypes.ADMIN ? Order.find() : Order.find({ userId: user._id }))
                .skip(pageNumber > 0 ? ((pageNumber - 1) * perPage) : 0)
                .limit(perPage)

            res.status(200).send({
                page: pageNumber,
                pageCount: Math.ceil(count / perPage),
                orders: orders
            })

        } catch (error) {
            res.status(400).send({ description: error.message })
        }

    }

    return {
        placeOrder,
        getOrders,
        updateOrder
    }

}


