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


    it('Should logout user', async () => {
        const res = await request(app)
            .post('/auth/logout')
            .set('Authorization', 'Bearer ' + token)

        expect(res.statusCode).toEqual(200)
    })
})
