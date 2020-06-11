const mongoose = require('mongoose')
const User = require('../models/userModel');
const UserRoles = require('../common/userRoles');
const config = require('../config')

describe('User Model Test', () => {
    // Connection to MongoDB memory server
    beforeAll(async () => {
        await mongoose.connect(config.MONGO_URI, {useNewUrlParser: true, useCreateIndex: true}, (err) => {
            if (err){
                console.error(err)
                process.exit(1)
            }
        })
    })

    it ('Create and save user successfully', async () => {
        const newUser = new User({
            name: 'ConsumerName',
            surname: 'ConsumerSurname',
            email: 'consumer@test.it',
            password: 'nonhashedpassword',
            role: UserRoles.CONSUMER,
        });

        const savedUser = await newUser.save()

        expect(savedUser._id).toBeDefined()
        expect(savedUser.name).toBe(newUser.name)
        expect(savedUser.surname).toBe(newUser.surname)
        expect(savedUser.email).toBe(newUser.email)
        expect(savedUser.password).toBe(newUser.password)
        expect(savedUser.role).toBe(newUser.role)
    })














})
