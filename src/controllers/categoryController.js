const Category = require('../models/categoryModel')

exports.get_category = async (req, res) => {
    // TODO
}

exports.create_category = async (req, res) => {
    try {
        const {name, image} = req.body
        console.log(req.body.name)
    
        if (name == null){
            res.status(401).send({message: 'Wrong parameters'})
        }
            
        const existentCategory = await Category.findOne({ name })
        console.log(existentCategory)
        if (existentCategory) {
            res.status(400).send({ description: 'Category already present' })
        }
        console.log(existentCategory)

        const category = new Category({
            name,
            image
        })

        await category.save();
    
        res.status(201).send({message: 'Category successfully created'})
    } catch (error) {
        console.log(error.message)
        res.status(400).send({ description: error.message })
    }
}

exports.update_category = async (req, res) => {
    // TODO
}

exports.delete_category = async (req, res) => {
    // TODO
}