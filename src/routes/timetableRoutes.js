module.exports = (app) => {
    const timetableController = require('../controllers/timetableController')

    app.route('/timetable/week')
        .get(timetableController.get_week)

    app.route('/timetable/day')
        .get(auth, timetableController.get_day)
        .put(auth, timetableController.update_day)
}