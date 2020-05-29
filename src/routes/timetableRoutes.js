module.exports = (app) => {
    const timetableController = require('../controllers/timetableController')
    const auth = require('../middlewares/authMiddleware')

    app.route('/timetable')
        .get(timetableController.get_timetable)
        .put(auth, timetableController.update_timetable)

    app.route('/timetable/today')
        .get(auth, timetableController.get_today_timetable)
}