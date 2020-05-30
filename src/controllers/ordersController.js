const UserRoleTypes = {
    ADMIN: 'admin',
    CONSUMER: 'consumer',
    RIDER: 'rider'
}

const Order = require('../models/orderModel')

exports.placeOrder = async (req, res) => {
    try {

        const { name, surname, address, city, timeSlot, telephoneNumber, paymentType } = req.body
        console.log(req.body)

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

    } catch (error) {
        res.status(400).send({ description: error.message })
    }
}

// qui potremmo passare id e order state: consegnato, in consegna
exports.updateOrder = async (req, res) => {
    res.status(400).send({ description: 'not implemented yet' })
}

exports.getOrders = async (req, res) => {
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
