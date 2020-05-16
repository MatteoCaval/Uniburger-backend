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

categorySchema.statics.findProductById = async (productId) => {
    const categories = await Category.find()
    let matchingProduct = null
    categories.forEach(async (category) => {
        category.products.forEach(async (product) => {
            if (product._id == productId) {
                matchingProduct = product
            }
        });
    });
    return matchingProduct
}


const Category = mongoose.model("Category", categorySchema, "Categories")
module.exports = Category