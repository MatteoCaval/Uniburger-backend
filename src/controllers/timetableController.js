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
        const days = req.body.timetable;

        await TimetableDay.deleteMany({})

        const dayList = days && days.map(day => {
            return new TimetableDay({
                name: day.name,
                launchOpen: day.launchOpen,
                dinnerOpen: day.dinnerOpen,
                ...(day.launchOpen && { launch: { ...day.launch } }),
                ...(day.dinnerOpen && { dinner: { ...day.dinner } })
            })
        })

        await TimetableDay.insertMany(dayList)

        res.status(200).send({ message: "Timetable successfully updated" })

    } catch (error) {
        console.log(error.message);
        res.status(400).send({ description: error.message });
    }
}

exports.get_today_timetable = async (req, res) => {
    const todayIndex = new Date().getDay();
    var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    var name = weekday[todayIndex];

    const todayTimetable = await TimetableDay.findOne({name});

    if (todayTimetable) {
        let launchSlots = []
        let dinnerSlots = []

        let now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        if (todayTimetable.launchOpen){
            launchSlots = generateSlots(todayTimetable.launch.timeStart, todayTimetable.launch.timeEnd, now)
        }


        if (todayTimetable.dinnerOpen){
            dinnerSlots = generateSlots(todayTimetable.dinner.timeStart, todayTimetable.dinner.timeEnd, now)
        }

        const slots = launchSlots.concat(dinnerSlots);

        let filteredSlots = slots.filter(slot => {
            if (slot.hour >= currentHour){
                return true;
            }

            if (slot.hour == currentHour && slot.minute >= currentMinute){
                return true;
            }

            return false;
        })

        res.status(201).send(filteredSlots.map(slot => {
            return slot.hour + ":" + (slot.minute == 0 ? "00": slot.minute)
        }));

    } else {
        res.status(404).send({ message: "Cannot find today timetable" });
    }
}

const generateSlots = (start, end)  => {
    let hourStart = start.hour;
    const minutesStart = start.minute;
    const hourEnd = end.hour;
    const minutesEnd = end.minute;    
    
	const slots = [];
	var slices = [0, 30];

	if (minutesStart == 30) {
		slots.push({
            hour: hourStart,
            minute: minutesStart
        });

		hourStart++;
	}

	for (var i = hourStart; i < hourEnd; i++) {
		for (var j = 0; j < slices.length; j++) {
			slots.push({
                hour: i,
                minute: slices[j]
            });
		}
	}

	slots.push({
        hour: hourEnd,
        minute: 0
    });

	if (minutesEnd == 30) {
		slots.push({
            hour: hourEnd,
            minute: minutesEnd
        });
	}

	return slots;
}