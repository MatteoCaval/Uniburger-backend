const dbHandler = require('./db-handler')
const request = require('supertest')
const app = require('./../../index.js');
const userRoles = require('../common/userRoles');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs')

const adminCredentials = {
    email: "admin@test.it",
    password: "admin",
    name: 'Admin',
    surname: 'Admin',
    role: userRoles.ADMIN
}

const category1 = {
    name: "Category1",
    image: 'image/path/1',
    _id: ""
}

const product1 = {
    name: "Product1",
    description: "Product 1 description",
    price: 25,
    image: "image/path/1",
    ingredients: ["Acqua", "Farina", "Sale", "Pepe"]
}

let adminToken = ""

beforeAll(async () => {
    await dbHandler.connect()

    const hashedPassword = await bcrypt.hash(adminCredentials.password, 8)
    const user = new User({
        email: adminCredentials.email,
        password: hashedPassword,
        name: adminCredentials.name,
        surname: adminCredentials.surname,
        role: userRoles.ADMIN
    })
    await user.save()

    const res = await request(app)
        .post('/auth/signin')
        .send({
            email: adminCredentials.email,
            password: adminCredentials.password
        })

    adminToken = res.body.token
});

afterEach(async () => {
    //await dbHandler.clearDatabase()
});

afterAll(async done => {
    await dbHandler.clearDatabase()
    await dbHandler.closeDatabase()
    done();
});

describe('Category & Product services', () => {

    it('Should get categories', async () => {
        const res = await request(app)
            .get('/catalog/categories')

        expect(res.status).toEqual(201)
    })

    it('Allow Admin to create new category', async () => {
        const res = await request(app)
            .post('/catalog/categories')
            .set('Authorization', 'Bearer ' + adminToken)
            .send({
                name: category1.name,
                image: category1.image
            })
        expect(res.status).toEqual(201)

        const categoriesRes = await request(app)
            .get('/catalog/categories')

        expect(categoriesRes.body).toHaveLength(1)
        category1._id = categoriesRes.body[0].id;
    })

    it('Admin should create product', async () => {

        const categoriesRes = await request(app)
            .get('/catalog/categories')


        expect(categoriesRes.body).toHaveLength(1)
        const res = await request(app)
        .post('/catalog/products')
        .set('Authorization', 'Bearer ' + adminToken)
        .send({
            name: product1.name,
            description: product1.description,
            price: product1.price,
            image: product1.image,
            ingredients: product1.ingredients,
            category_id: `${category1._id}`
        })

        expect(res.statusCode).toEqual(201)
        const res2 = await request(app)
        .get('/catalog/products')
        .query({categoryId: `${category1._id}`})

        expect(res2.body).toHaveLength(1)
        product1._id = res2.body[0].id
    })

    it('Admin shouldn\'t delete not empty category', async () => {
        const res = await request(app)
            .delete('/catalog/categories/' + `${category1._id}`)
            .set('Authorization', 'Bearer ' + adminToken)

        expect(res.status).toEqual(400)
    })

    it('Should get category products', async () => {
        const res = await request(app)
        .get('/catalog/products')
        .query({categoryId: `${category1._id}`})

        expect(res.statusCode).toEqual(201)
    })

    it('Should get product info', async () => {
        const res = await request(app)
        .get('/catalog/products/' + `${product1._id}`)

        expect(res.statusCode).toEqual(201)

        expect(res.body.name).toBe(product1.name)
        expect(res.body.categoryId).toBe(category1._id)
        expect(res.body.categoryName).toBe(category1.name)
        expect(res.body.description).toBe(product1.description)
        expect(res.body.image).toBe(product1.image)
        expect(res.body.price).toBe(product1.price)
        expect(res.body.ingredients.length).toBe(product1.ingredients.length)
    })

    it('Admin should update product', async () => {

        const newName = "New name"
        const newDescription = "New description"
        const newImage = "new/image/path"
        const newPrice = 30
        const newIngredients = ["Olio", "Farina"]

        const res = await request(app)
        .put('/catalog/products/' + `${product1._id}`)
        .set('Authorization', 'Bearer ' + adminToken)
        .send({
            name: newName,
            description: newDescription,
            image: newImage,
            price: newPrice,
            ingredients: newIngredients
        })
        
        expect(res.statusCode).toEqual(201)

        const productInfoRes = await request(app)
        .get('/catalog/products/' + `${product1._id}`)

        expect(productInfoRes.body.name).toBe(newName)
        expect(productInfoRes.body.description).toBe(newDescription)
        expect(productInfoRes.body.image).toBe(newImage)
        expect(productInfoRes.body.price).toBe(newPrice)
        expect(productInfoRes.body.ingredients).toHaveLength(newIngredients.length)
    })

    it('Admin should delete product', async () => {
        const res = await request(app)
        .delete('/catalog/products/' + `${product1._id}`)
        .set('Authorization', 'Bearer ' + adminToken)

        expect(res.statusCode).toEqual(201)

        const productsRes = await request(app)
        .get('/catalog/products')
        .query({categoryId: `${category1._id}`})

        expect(productsRes.body).toHaveLength(0)
    })

    it('Admin should update category', async () => {
        const newName = "NewCategory1"
        const newImagePath = "new/image/path/1"
        const res = await request(app)
            .put('/catalog/categories/' + `${category1._id}`)
            .set('Authorization', 'Bearer ' + adminToken)
            .send({
                name: newName,
                image: newImagePath
            })

        expect(res.status).toEqual(201)
    })

    it('Admin should delete category', async () => {
        const res = await request(app)
            .delete('/catalog/categories/' + `${category1._id}`)
            .set('Authorization', 'Bearer ' + adminToken)

        expect(res.status).toEqual(201)
        const categoriesRes = await request(app)
            .get('/catalog/categories')

        expect(categoriesRes.body).toHaveLength(0)
    })
})