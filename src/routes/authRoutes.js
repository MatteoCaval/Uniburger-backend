module.exports = (app) => {
    const authController = require('../controllers/authController')
    const auth = require('../middlewares/authMiddleware')

    app.route('/auth/signin')
        .post(authController.signin)

    app.route('/auth/logout')
        .post(auth, authController.logout)

    app.route('/auth/signup')
        .post(authController.signup)
}