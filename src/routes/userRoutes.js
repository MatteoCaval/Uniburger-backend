module.exports = (app, io) => {
    const userController = require('../controllers/userController')
    const orderController = require('../controllers/ordersController')(io)
    const auth = require('../middlewares/authMiddleware')

    app.route('/user/orders')
        .get(auth, orderController.getOrders)

    app.route('/user')
        .get(auth, userController.get_user)

    app.route('/user/cart')
        .post(auth, userController.add_product_to_cart)
        .get(auth, userController.get_user_cart)

    app.route('/user/cart/:productId')
        .delete(auth, userController.delete_product_from_cart)
        .put(auth, userController.update_cart_product)

}