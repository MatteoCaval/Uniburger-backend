const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
})


const Category = mongoose.model("Category", categorySchema, "Categories")
module.exports = Category