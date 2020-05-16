const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const Category = require("../models/categoryModel");

// TODO estrarre parte di generazione token e hash password, queste sono solo prove

exports.get_user = async (req, res) => {
    const { name, email } = req.user
    res.status(200).send({ name, email })
}

exports.get_user_orders = async (req, res) => {
    // TODO
}

exports.delete_user = async (req, res) => {
    // TODO
}

exports.add_product_to_cart = async (req, res) => {
    try {
        const user = req.user
        const { productId } = req.body
        // controllare se prodotto esiste
        await user.addProductToCart(productId)
        res.status(200).send({ desription: `product added` })
    } catch (e) {
        console.log(e)
        res.status(400).send({ description: 'Error adding product to cart' })
    }
}

exports.get_user_cart_products = async (req, res) => {
    try {
        const user = req.user
        const products = await Promise.all(user.cart.map(async cartItem => {
            const matchingProduct = await Category.findProductById(cartItem.productId)
            return matchingProduct
        }))

        res.status(200).send(products.map(prod => {
            return {
                id: prod._id,
                name: prod.name,
                price: prod.price,
                image: prod.image
            }
        }))
    } catch (e) {
        console.log(e)
        res.status(400).send({ description: 'Error adding product to cart' })
    }
}







