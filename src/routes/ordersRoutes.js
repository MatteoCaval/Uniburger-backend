module.exports = (app, io) => {
    const ordersController = require('../controllers/ordersController')(io)
    const auth = require('../middlewares/authMiddleware')

    app.route('/orders')
        .post(auth, ordersController.placeOrder)
        .get(auth, ordersController.getOrders)

    app.route("/orders/:orderId")
        .put(auth, ordersController.updateOrder)

    app.route('/user/orders')
        .get(auth, ordersController.getOrders)
}