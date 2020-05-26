module.exports = (app) => {
    const userController = require('../controllers/userController')
    const authController = require('../controllers/authController')
    const auth = require('../middlewares/authMiddleware')

    app.route('/riders')
        .get(auth, userController.get_users('rider'))
        .post(auth, authController.signup('rider'))

    app.route('/riders/:userId')
        .delete(auth, authController.delete_user)
}