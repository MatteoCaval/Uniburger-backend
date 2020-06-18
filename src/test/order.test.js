const dbHandler = require('./db-handler')
const OrderState = require('../common/orderState')
const PaymentType = require('../common/paymentType')
const User = require('../models/userModel')
const request = require('supertest')
const app = require('./../../index.js')
const bcrypt = require('bcryptjs')
const UserRoles = require('../common/userRoles')
const Category = require('../models/categoryModel')
const Product = require('../models/productModel')
const Order = require('../models/orderModel')

const orderData = {
    name: "Name",
    surname: "Surname",
    address: "via Roma, 1",
    city: "Cesena",
    timeSlot: "20:30",
    telephoneNumber: "3331231231",
    paymentType: PaymentType.ON_DELIVERY,
    _id: ""
}

const consumerData = {
    name: 'ConsumerName',
    surname: 'ConsumerSurname',
    email: 'consumer@test.it',
    password: 'nonhashedpassword',
    role: UserRoles.CONSUMER,
    cart: []
}

const adminData = {
    email: "admin@test.it",
    password: "admin",
    name: 'Admin',
    surname: 'Admin',
    role: UserRoles.ADMIN
}

const riderData = {
    email: "rider@test.it",
    password: "rider",
    name: 'RiderName',
    surname: 'RiderSurname',
    role: UserRoles.RIDER,
    _id: ""
}

let product1 = {
    name: "Product1",
    description: "Product 1 description",
    price: 25,
    image: "image/path/1",
    ingredients: ["Acqua", "Farina", "Sale", "Pepe"],
    categoryName: "",
    categoryId: "",
    _id: ""
}

let consumerToken = ""
let adminToken = ""
let riderToken = ""

beforeAll(async () => {
    await dbHandler.connect()

    // Create user with products in cart
    const category = new Category({
        name: "Category Test",
    })

    const savedCat = await category.save()
    product1.categoryId = savedCat._id
    product1.categoryName = category.name

    const prod1 = new Product({
        name: product1.name,
        description: product1.description,
        price: product1.price,
        image: product1.image,
        ingredients: product1.ingredients,
        categoryName: product1.categoryName,
        categoryId: product1.categoryId,
    })

    const savedProd = await prod1.save()
    product1._id = savedProd._id

    let hashedPassword = await bcrypt.hash(consumerData.password, 8)
    consumerData.cart = [
        {
            productId: product1._id,
            quantity: 2,
            name: product1.name,
            price: 15
        }
    ]

    const user = new User({
        email: consumerData.email,
        password: hashedPassword,
        name: consumerData.name,
        surname: consumerData.surname,
        role: consumerData.role,
        cart: consumerData.cart
    })

    await user.save()

    const res = await request(app)
        .post('/auth/signin')
        .send({
            email: consumerData.email,
            password: consumerData.password
        })

    consumerToken = res.body.token

    // Create admin
    hashedPassword = await bcrypt.hash(adminData.password, 8)
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

    // Create rider
    hashedPassword = await bcrypt.hash(riderData.password, 8)
    const rider = new User({
        email: riderData.email,
        password: hashedPassword,
        name: riderData.name,
        surname: riderData.surname,
        role: riderData.role
    })
    const savedRider = await rider.save()
    riderData._id = savedRider._id

    const riderRes = await request(app)
        .post('/auth/signin')
        .send({
            email: riderData.email,
            password: riderData.password
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


describe('Order Model Test', () => {

    it('Should get orders', async () => {
        const res = await request(app)
            .get('/orders')
            .set('Authorization', 'Bearer ' + consumerToken)

        expect(res.statusCode).toEqual(200)
        expect(res.body.orders).toHaveLength(0)
        expect(res.body.pageCount).toBe(0)
    })

    it('Should get orders for current user', async () => {
        const res = await request(app)
            .get('/user/orders')
            .set('Authorization', 'Bearer ' + consumerToken)

        expect(res.statusCode).toEqual(200)
        expect(res.body.orders).toHaveLength(0)
        expect(res.body.pageCount).toBe(0)
    })

    
    it('Should place order for current user', async () => {
        const res = await request(app)
            .post('/orders')
            .set('Authorization', 'Bearer ' + consumerToken)
            .send(orderData)

        expect(res.statusCode).toEqual(201)

        const ordersRes = await request(app)
            .get('/orders')
            .set('Authorization', 'Bearer ' + consumerToken)

        expect(ordersRes.body.orders).toHaveLength(1)
        expect(ordersRes.body.pageCount).toBe(1)

        const myOrder = ordersRes.body.orders[0]
        orderData._id = myOrder._id

        expect(myOrder.state).toBe(OrderState.PENDING)

        let total = 0
        consumerData.cart.forEach(product => {
            total += product.price * product.quantity
        })

        expect(myOrder.totalPrice).toBe(total)
        expect(myOrder.products).toHaveLength(consumerData.cart.length)
    })


    it('Admin should update order state to in delivery', async () => {
        const res = await request(app)
            .put('/orders/'+ `${orderData._id}`)
            .set('Authorization', 'Bearer ' + adminToken)
            .send({
                riderId: riderData._id,
                state: OrderState.IN_DELIVERY
            })

        expect(res.statusCode).toEqual(201)
    })

    it('Rider shouldn\'t update order state to in delivery', async () => {
        const res = await request(app)
            .put('/orders/'+ `${orderData._id}`)
            .set('Authorization', 'Bearer ' + riderToken)
            .send({
                riderId: riderData._id,
                state: OrderState.IN_DELIVERY
            })

        expect(res.statusCode).toEqual(403)
    })

    it('Consumer shouldn\'t update order state to in delivery', async () => {
        const res = await request(app)
            .put('/orders/'+ `${orderData._id}`)
            .set('Authorization', 'Bearer ' + consumerToken)
            .send({
                riderId: riderData._id,
                state: OrderState.IN_DELIVERY
            })

        expect(res.statusCode).toEqual(403)
    })

    it('Should get rider orders', async () => {
        const riderOrders = await Order.getRiderOrders(riderData._id)
        expect(riderOrders).toHaveLength(1)
    })

    it('Rider should update order state to delivered', async () => {
        const res = await request(app)
            .put('/orders/'+ `${orderData._id}`)
            .set('Authorization', 'Bearer ' + riderToken)
            .send({
                state: OrderState.DELIVERED
            })

        expect(res.statusCode).toEqual(201)
    })

    it('Should get orders by multiple states', async () => {
        const orders = await Order.getOrdersByStates([OrderState.IN_DELIVERY, OrderState.DELIVERED])
        expect(orders).toHaveLength(1)
    })

    it('Should get orders by single state', async () => {
        const orders = await Order.getOrdersByStates([OrderState.DELIVERED])
        expect(orders).toHaveLength(1)
    })

    it('Should get an empty array if no orders', async () => {
        const orders = await Order.getOrdersByStates([OrderState.PENDING])
        expect(orders).toHaveLength(0)
    })
})
