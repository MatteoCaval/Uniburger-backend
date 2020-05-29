const TimetableDay = require("../models/timetableDayModel");

exports.get_timetable = async (req, res) => {
    try {
        const days = await TimetableDay.find({});
        res.status(201).send(days.map(day => {
            return {
                id: day._id,
                name: day.name,
                launchOpen: day.launchOpen,
                dinnerOpen: day.dinnerOpen,
                launch: day.launch,
                dinner: day.dinner
            }
        }));
    } catch (error) {
        console.log(error.message);
        res.status(400).send({ description: error.message });
    }
}

exports.update_timetable = async (req, res) => {
    try {
        console.log(req.body)
        const days = req.body.timetable;

        await TimetableDay.deleteMany({})

        const lista = days.map(day => {

            return new TimetableDay({
                name: day.name,
                launchOpen: day.launchOpen,
                dinnerOpen: day.dinnerOpen,
                ...(day.launchOpen && { launch: { ...day.launch } }),
                ...(day.dinnerOpen && { dinner: { ...day.dinner } })
            })
        })

        console.log(lista)

        await TimetableDay.insertMany(lista)

        res.status(200).send({ message: "Timetable successfully updated" })

    } catch (error) {
        console.log(error.message);
        res.status(400).send({ description: error.message });
    }
}

exports.get_today_timetable = async (req, res) => {
    const todayIndex = new Date().getDay() - 1;
    var weekday = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    var name = weekday[todayIndex];

    const todayTimetable = await TimetableDay.findOne({name});

    if (todayTimetable) {
        res.status(201).send({
            name: todayTimetable.name,
            launchOpen: todayTimetable.launchOpen,
            dinnerOpen: todayTimetable.dinnerOpen,
            launch: todayTimetable.launch,
            dinner: todayTimetable.dinner
        });
    } else {
        res.status(404).send({ message: "Cannot find today timetable" });
    }
}