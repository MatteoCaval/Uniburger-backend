const config = require('./src/config')
const mongoose = require('mongoose')
const User = require('./src/models/userModel')
const bcrypt = require('bcryptjs')

mongoose.connect(
    config.MONGO_URI, // test nome del database, non della collection
    {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })


const createAdmin = async () => {
    try {
        const password = 'admin'
        const hashedPassword = await bcrypt.hash(password, 8)
        const user = new User({
            email: 'admin@fooddelivery.it',
            password: hashedPassword,
            name: 'admin',
            surname: 'admin',
            role: 'admin'
        })
        await user.save()
    } catch (e) {
        console.log(e)
    }
}

createAdmin()
    .then(result => console.log('admin created'))
    .catch(e => console.log(e.message))