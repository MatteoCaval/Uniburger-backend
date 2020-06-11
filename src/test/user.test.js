const dbHandler = require('./db-handler')
const User = require('../models/userModel');
const UserRoles = require('../common/userRoles');

const consumerData = {
    name: 'ConsumerName',
    surname: 'ConsumerSurname',
    email: 'consumer@test.it',
    password: 'nonhashedpassword',
    role: UserRoles.CONSUMER,
}

const token = 'AAAAAAAAAAAAAAAAAAAA'

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


beforeAll(async () => await dbHandler.connect());

afterEach(async () => {
    //await dbHandler.clearDatabase()
});

afterAll(async () => {
    await dbHandler.clearDatabase()
    await dbHandler.closeDatabase()
});

describe('User Model Test', () => {

    it('Create and save user successfully', async () => {

        const newUser = new User(consumerData);
        const savedUser = await newUser.save()

        expect(savedUser._id).toBeDefined()
        expect(savedUser.name).toBe(newUser.name)
        expect(savedUser.surname).toBe(newUser.surname)
        expect(savedUser.email).toBe(newUser.email)
        expect(savedUser.password).toBe(newUser.password)
        expect(savedUser.role).toBe(newUser.role)
        expect(savedUser.tokens).toHaveLength(0);
    })

    it('Add multiple tokens to a user', async () => {
        const user = await User.findOne({ email: consumerData.email })

        expect(user).toBeTruthy();

        user.tokens.push({ token })
        user.tokens.push({ token: "BBBBBBBBBBBBBBBBBBBBB" })

        await user.save()
        expect(user.tokens).toHaveLength(2);
    })

    it('Remove token from user', async () => {
        const user = await User.findOne({ email: consumerData.email })

        expect(user).toBeTruthy();

        user.tokens = user.tokens.filter(t => t.token !== token);

        await user.save()
        expect(user.tokens).toHaveLength(1);
    })

    it('Add items to cart', async () => {
        const user = await User.findOne({ email: consumerData.email })
        expect(user).toBeTruthy();

        user.cart.push(cartItem1)
        user.cart.push(cartItem2)

        expect(user.cart).toHaveLength(2)
        expect(user.cart[0].quantity).toBe(2)
    })
})
