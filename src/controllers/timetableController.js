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
        const days = req.body;
        await TimetableDay.deleteMany({})

        const lista = days.map(day => {
            
            return new TimetableDay({
                name: day.name,
                launchOpen: day.launchOpen,
                dinnerOpen: day.dinnerOpen,
                ...(day.launchOpen && {launch: {...day.launch}}),
                ...(day.dinnerOpen && {dinner: {...day.dinner}})
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

exports.get_day = async (req, res) => {
    // TODO
}