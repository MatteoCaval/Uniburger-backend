const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
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
    ingredients: [String]
})

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    products: [productSchema]
})

const Category = mongoose.model("Category", categorySchema, "Categories")
module.exports = Category