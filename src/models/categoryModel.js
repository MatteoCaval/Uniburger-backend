const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    products: [{
        id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        image: {
            type: String,
        },
        price: {
            type: Number,
        },
        ingredients: [{
            ingredient: {
                type: String,
            }
        }],
    }]
})

const Category = mongoose.model("Category", categorySchema, "Categories")
module.exports = Category