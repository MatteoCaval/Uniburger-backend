const dbHandler = require('./db-handler')
const UserRoles = require('../common/userRoles');
const User = require('../models/userModel');
const request = require('supertest')
const app = require('./../../index.js')

const consumerData = {
    name: 'ConsumerName',
    surname: 'ConsumerSurname',
    email: 'consumer@test.it',
    password: 'nonhashedpassword',
    role: UserRoles.CONSUMER,
}

const cartItem1 = {
    quantity: 2,
    name: "Product1",
    image: "image/path/1",
    price: 20
}

const cartItem2 = {
    quantity: 1,
    name: "Product2",
    image: "image/path/2",
    price: 10
}


beforeAll(async () => {
    await dbHandler.connect()
});

afterEach(async () => {
    //await dbHandler.clearDatabase()
});

afterAll(async () => {
    await dbHandler.clearDatabase()
    await dbHandler.closeDatabase()
});

describe('User Model Test', () => {
    it('Should create new user', async () => {
        const res = await request(app)
        .post('/auth/signup')
        .query({role: UserRoles.CONSUMER})
        .send(consumerData)

        expect(res.statusCode).toEqual(201)
        expect(res.body).toHaveProperty('token')
    })

    it('Should signin user', async () => {
        const res = await request(app)
        .post('/auth/signin')
        .send({
            email: consumerData.email,
            password: consumerData.password
        })

        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('token')
    })

    it ('Should add item to cart', async () => {
        const user = await User.findUserByCredential(consumerData.email, consumerData.password)

        const res = await request(app)
        .post('/user/cart')
        .send({
            productId: '123abc123abc',
            quantity: 2
        })

        expect(res.statusCode).toEqual(200)
    })


    it('Should logout user', async () => {
        const user = await User.findUserByCredential(consumerData.email, consumerData.password)
        const res = await request(app)
        .post('/auth/logout')
        .send(user)

        expect(res.statusCode).toEqual(200)
    })




    /*





    it('Add items to cart', async () => {
        const user = await User.findOne({ email: consumerData.email })
        expect(user).toBeTruthy();

        user.cart.push(cartItem1)
        user.cart.push(cartItem2)

        expect(user.cart).toHaveLength(2)
        expect(user.cart[0].quantity).toBe(2)
    })
    */
})
