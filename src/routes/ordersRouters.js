module.exports = (app) => {
    const ordersController = require('../controllers/ordersController')
    const auth = require('../middlewares/authMiddleware')

    app.route('/orders')
        .post(auth, ordersController.placeOrder)
        .put(auth, ordersController.updateOrder)
        .get(auth, ordersController.getOrders)
}