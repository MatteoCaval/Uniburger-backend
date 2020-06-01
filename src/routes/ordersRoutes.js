module.exports = (app, io) => {
    const ordersController = require('../controllers/ordersController')(io)
    const auth = require('../middlewares/authMiddleware')

    app.route('/orders')
        .post(auth, ordersController.placeOrder)
        .put(auth, ordersController.updateOrder)
        .get(auth, ordersController.getOrders)
}