module.exports = (app) => {
    const userController = require('../controllers/userController')
    const auth = require('../middlewares/authMiddleware')
    app.route('/user/login')
        .post(userController.login)

    app.route('/user/logout')
        .post(auth, userController.logout)

    app.route('/user')
        .post(userController.create_user)
        .get(auth, userController.get_user)

}