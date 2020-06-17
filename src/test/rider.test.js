const dbHandler = require('./db-handler')
const UserRoles = require('../common/userRoles');
const request = require('supertest')
const app = require('./../../index.js');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs')

const riderData = {
    name: 'RiderName',
    surname: 'RiderSurname',
    email: 'rider@test.it',
    password: 'nonhashedpassword',
}

const rider2Data = {
    name: 'Rider2Name',
    surname: 'Rider2Surname',
    email: 'rider2@test.it',
    password: 'nonhashedpassword',
    _id: ""
}

const adminData = {
    email: "admin@test.it",
    password: "admin",
    name: 'Admin',
    surname: 'Admin',
    role: UserRoles.ADMIN
}

let adminToken = ""
let riderToken = ""

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

    // Create an other rider for testing
    await dbHandler.connect()

    hashedPassword = await bcrypt.hash(rider2Data.password, 8)

    const user = new User({
        email: rider2Data.email,
        password: hashedPassword,
        name: rider2Data.name,
        surname: rider2Data.surname,
        role: UserRoles.RIDER
    })
    const savedRider = await user.save()
    rider2Data._id = savedRider._id

    const riderRes = await request(app)
        .post('/auth/signin')
        .send({
            email: rider2Data.email,
            password: rider2Data.password
        })

    riderToken = riderRes.body.token
});

afterEach(async () => {
    //await dbHandler.clearDatabase()
});

afterAll(async () => {
    await dbHandler.clearDatabase()
    await dbHandler.closeDatabase()
});

describe('Rider Model Test', () => {
    it('Admin should create new rider', async () => {
        const res = await request(app)
            .post('/riders')
            .set('Authorization', 'Bearer ' + adminToken)
            .send(riderData)

        expect(res.statusCode).toEqual(201)
        expect(res.body).toHaveProperty('token')
    })

    it('Rider should\'t create new rider', async () => {
        const res = await request(app)
            .post('/riders')
            .set('Authorization', 'Bearer ' + riderToken)
            .send(riderData)

        expect(res.statusCode).toEqual(403)
    })

    it('Should get riders', async () => {
        const res = await request(app)
            .get('/riders')
            .set('Authorization', 'Bearer ' + adminToken)
  
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveLength(2)
    })

    it('Rider shouldn\'t delete rider', async () => {
        const res = await request(app)
            .delete('/riders/' + `${rider2Data._id}`)
            .set('Authorization', 'Bearer ' + riderToken)
            
        expect(res.statusCode).toEqual(403)
    })

    it('Admin should delete rider', async () => {
        const res = await request(app)
            .delete('/riders/' + `${rider2Data._id}`)
            .set('Authorization', 'Bearer ' + adminToken)
            
        expect(res.statusCode).toEqual(200)
    })
})
