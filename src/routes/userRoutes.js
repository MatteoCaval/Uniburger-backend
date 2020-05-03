module.exports = (app) => {
    const userController = require('../controllers/userController')
    app.route('/user/login')
        .post(userController.login)

    app.route('/user')
        .post(userController.create_user)

}