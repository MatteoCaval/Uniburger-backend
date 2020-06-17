module.exports = (app) => {
    const userController = require('../controllers/userController')
    const authController = require('../controllers/authController')
    const auth = require('../middlewares/authMiddleware')
    const adminAuth = require('../middlewares/adminAuthMiddleware')

    app.route('/riders')
        .get(auth, userController.get_users('rider'))
        .post(auth, authController.signup('rider'))

    app.route('/riders/:userId')
        .delete(adminAuth, authController.delete_user) //ok
}