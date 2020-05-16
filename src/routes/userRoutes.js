module.exports = (app) => {
    const userController = require('../controllers/userController')
    const auth = require('../middlewares/authMiddleware')

    app.route('/user/orders')
        .get(userController.get_user_orders)

    app.route('/user')
        .get(auth, userController.get_user)
        .delete(auth, userController.delete_user)

    app.route('/user/cart')
        .post(auth, userController.add_product_to_cart)
        .get(auth, userController.get_user_cart)

}