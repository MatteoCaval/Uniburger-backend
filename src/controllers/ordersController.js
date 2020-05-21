const Order = require('../models/orderModel')

exports.placeOrder = async (req, res) => {
    try {

        const { name, surname, address, city, timeSlot, telephoneNumber, paymentType} = req.body
        console.log(req.body)

        const user = req.user
        const order = new Order({
            name,
            surname,
            userId: user._id,
            totalPrice: 50,
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
                    name: 'nome temporaneo in attesa di reperirlo',
                    quantity: product.quantity,
                    price: 555

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
    // try {
    //     const user = req.user
    //
    // } catch (error) {
        res.status(400).send({ description: 'not implemented yet' })
    // }

}
