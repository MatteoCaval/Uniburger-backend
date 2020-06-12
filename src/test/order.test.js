const dbHandler = require('./db-handler')
const Order = require('../models/orderModel')
const OrderState = require('../common/orderState')
const PaymentType = require('../common/paymentType')
const User = require('../models/userModel')
const UserRoles = require('../common/userRoles')

const orderData = {
    userFullName: "Name Surname",
    totalPrice: 60,
    address: "via Roma, 1",
    city: "Cesena",
    creationDate: new Date(),
    date: new Date(),
    time: "20:30",
    userId: "test_user_id",
    telephoneNumber: "3331231231",
    state: OrderState.PENDING,
    paymentType: PaymentType.ON_DELIVERY
}

const product = {
    name: "Product",
    price: 10,
    quantity: 5
}

const rider = {
    name: "RiderName",
    surname: "RiderSurname",
    email: "rider@test.it",
    role: UserRoles.RIDER
}

beforeAll(async () => await dbHandler.connect());

afterEach(async () => {
    //await dbHandler.clearDatabase()
});

afterAll(async () => {
    await dbHandler.clearDatabase()
    await dbHandler.closeDatabase()
});


describe('Order Model Test', () => {

    it('Create new order', async () => {
        const newOrder = new Order(orderData)
        const savedOrder = await newOrder.save()

        expect(savedOrder._id).toBeDefined()
        expect(savedOrder.userFullName).toBe(orderData.userFullName)
        expect(savedOrder.totalPrice).toBe(orderData.totalPrice)
        expect(savedOrder.city).toBe(orderData.city)
        expect(savedOrder.date).toBe(orderData.date)
        expect(savedOrder.creationDate).toBe(orderData.creationDate)
        expect(savedOrder.time).toBe(orderData.time)
        expect(savedOrder.userId).toBe(orderData.userId)
        expect(savedOrder.telephoneNumber).toBe(orderData.telephoneNumber)
        expect(savedOrder.state).toBe(orderData.state)
        expect(savedOrder.paymentType).toBe(orderData.paymentType)
        expect(savedOrder.products).toHaveLength(0)
    })

    it('Update order state', async () => {
        const order = await Order.findOne({ userId: orderData.userId })
        expect(order).toBeTruthy

        order.state = OrderState.IN_DELIVERY
        const updatedOrder = await order.save()

        expect(updatedOrder.state).toBe(OrderState.IN_DELIVERY)
    })

    it('Add order product', async () => {
        const order = await Order.findOne({ userId: orderData.userId })
        expect(order).toBeTruthy()

        order.products.push(product)
        const updatedOrder = await order.save()

        expect(updatedOrder.products).toHaveLength(1)
    })

    it('Assign order to rider', async () => {

        const order = await Order.findOne({ userId: orderData.userId })
        expect(order).toBeTruthy

        order.products.push(product)
        const updatedOrder = await order.save()

        expect(updatedOrder.products).toHaveLength(1)
    })

})
