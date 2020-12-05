const dbHandler = require('./db-handler')
const request = require('supertest')
const app = require('./../../index.js');
const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

const consumerData = {
    name: 'ConsumerName',
    surname: 'ConsumerSurname',
    email: 'consumer@test.it',
    password: 'nonhashedpassword'
}

const testCategory = {
    name: "Test Category",
    _id: ""
}

const product1 = {
    name: "Product1",
    image: "image/path/1",
    price: 20,
    _id: ""
}

let token = ""

beforeAll(async () => {
    await dbHandler.connect()

    const cat = Category({
        name: testCategory.name
    })

    const savedCategory = await cat.save()
    testCategory._id = savedCategory._id

    const prod1 = new Product({
        name: product1.name,
        categoryId: savedCategory._id,
        categoryName: savedCategory.name,
        image: product1.image,
        price: product1.price
    })

    const savedProd1 = await prod1.save()
    product1._id = savedProd1._id
});

afterEach(async () => {
    //await dbHandler.clearDatabase()
});

afterAll(async () => {
    await dbHandler.clearDatabase()
    await dbHandler.closeDatabase()
});

describe('User services', () => {
    it('Should create new user', async () => {
        const res = await request(app)
            .post('/auth/signup')
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
        token = res.body.token
    })

    it('Should return the actual user', async () => {
        const res = await request(app)
            .get('/user/current')
            .set('Authorization', 'Bearer ' + token)

        expect(res.body.email).toBe(consumerData.email)
        expect(res.body.name).toBe(consumerData.name)
        expect(res.body.surname).toBe(consumerData.surname)

        expect(res.statusCode).toEqual(200)
    })

    it('Should add item to cart', async () => {
        const res = await request(app)
            .post('/user/cart')
            .set('Authorization', 'Bearer ' + token)
            .send({
                productId: product1._id,
                quantity: 2
            })

        expect(res.statusCode).toEqual(200)

        const cartRes = await request(app)
            .get('/user/cart')
            .set('Authorization', 'Bearer ' + token)

        expect(cartRes.body.cartProducts).toHaveLength(1)
    })

    it('Should return user cart', async () => {
        const res = await request(app)
            .get('/user/cart')
            .set('Authorization', 'Bearer ' + token)

        expect(res.body.total).toBe(2 * product1.price)
        expect(res.body.cartProducts).toHaveLength(1)

        expect(res.statusCode).toEqual(200)
    })

    it('Should update cart product', async () => {
        const newQuantity = 1
        const res = await request(app)
            .put('/user/cart/' + `${product1._id}`)
            .set('Authorization', 'Bearer ' + token)
            .send({
                quantity: newQuantity
            })

        expect(res.statusCode).toEqual(200)

        const cartRes = await request(app)
            .get('/user/cart')
            .set('Authorization', 'Bearer ' + token)

        expect(cartRes.body.cartProducts).toHaveLength(1)
        expect(cartRes.body.cartProducts[0].quantity).toBe(newQuantity)
    })

    it('Should remove cart product', async () => {
        const res = await request(app)
            .delete('/user/cart/' + `${product1._id}`)
            .set('Authorization', 'Bearer ' + token)

        expect(res.statusCode).toEqual(200)

        const cartRes = await request(app)
            .get('/user/cart')
            .set('Authorization', 'Bearer ' + token)

        expect(cartRes.body.cartProducts).toHaveLength(0)
    })

    it('Should find user by credentials', async () => {
        const user = await User.findUserByCredential(consumerData.email, consumerData.password)

        expect(user).toBeTruthy()
        expect(user.name).toBe(consumerData.name)
        expect(user.surname).toBe(consumerData.surname)
    })

    it('Should add new token to user', async () => {
        let user = await User.findUserByCredential(consumerData.email, consumerData.password)
        const tokens = user.tokens

        const newToken = await user.generateAuthToken()

        user = await User.findUserByCredential(consumerData.email, consumerData.password)
        expect(user.tokens).toHaveLength(tokens.length + 1)


        expect(user.tokens).toEqual(        // expect an array which equals
            expect.arrayContaining([        // an array which contains
                expect.objectContaining({   // an object which contains
                    token: newToken         // a token like the new token
                })
            ])
        )
    })

    it('Should logout user', async () => {
        const res = await request(app)
            .post('/auth/logout')
            .set('Authorization', 'Bearer ' + token)

        expect(res.statusCode).toEqual(200)
    })
})
