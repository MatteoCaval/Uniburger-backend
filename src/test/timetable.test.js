const dbHandler = require('./db-handler')
const Timetable = require('../models/timetableDayModel');
const request = require('supertest')
const app = require('./../../index.js');
const UserRoles = require('../common/userRoles');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const timetableRoutes = require('../routes/timetableRoutes');


const adminData = {
    email: "admin@test.it",
    password: "admin",
    name: 'Admin',
    surname: 'Admin',
    role: UserRoles.ADMIN
}

const launchState = {
    timeStart: {
        hour: '12',
        minute: '00'
    },
    timeEnd: {
        hour: '14',
        minute: '00'
    }
}

const dinnerState = {
    timeStart: {
        hour: '18',
        minute: '00'
    },
    timeEnd: {
        hour: '22',
        minute: '00'
    }
}

const timeTable = [
    {
        name: 'Monday',
        launchOpen: true,
        dinnerOpen: false,
        launch: launchState
    },
    {
        name: 'Tuesday',
        launchOpen: false,
        dinnerOpen: true,
        dinner: dinnerState
    },
    {
        name: 'Wednesday',
        launchOpen: true,
        dinnerOpen: true,
        launch: launchState,
        dinner: dinnerState
    },
    {
        name: 'Thursday',
        launchOpen: false,
        dinnerOpen: false
    },
    {
        name: 'Friday',
        launchOpen: false,
        dinnerOpen: false
    },
    {
        name: 'Saturday',
        launchOpen: false,
        dinnerOpen: false
    },
    {
        name: 'Sunday',
        launchOpen: false,
        dinnerOpen: false
    }
]

let adminToken = ""

beforeAll(async () => {
    await dbHandler.connect()

    let hashedPassword = await bcrypt.hash(adminData.password, 8)

    const admin = new User({
        email: adminData.email,
        password: hashedPassword,
        name: adminData.name,
        surname: adminData.surname,
        role: adminData.role
    })
    await admin.save()

    const adminRes = await request(app)
        .post('/auth/signin')
        .send({
            email: adminData.email,
            password: adminData.password
        })
    adminToken = adminRes.body.token
});

afterEach(async () => {
    //await dbHandler.clearDatabase()
});

afterAll(async () => {
    await dbHandler.clearDatabase()
    await dbHandler.closeDatabase()
});

describe('Timetable Model Test', () => {
    it('Admin should update timetable', async () => {
        const res = await request(app)
            .put('/timetable')
            .set('Authorization', 'Bearer ' + adminToken)
            .send({
                timetable: timeTable
            })

        console.log(JSON.stringify(res.error))
        expect(res.status).toEqual(200)
    })

    it('Should get timetable', async () => {
        const res = await request(app)
            .get('/timetable')

        expect(res.status).toEqual(201)
        expect(res.body).toHaveLength(timeTable.length)
    })

    it('Should get today timetable', async () => {
        const res = await request(app)
            .get('/timetable/today')

        expect(res.status).toEqual(201)
        if (res.body.length > 0) {
            expect(res.body[0]).toMatch(/[0-9]+:[0-9]+/)
        }
    })
})

