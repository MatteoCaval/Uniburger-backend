const User = require('../models/userModel')
const Product = require("../models/productModel");
const Order = require('../models/orderModel')


exports.get_users = (userRole) => {
    return async (req, res) => {
        try {
            const user = req.user
            if (!user) {
                res.status(403).send({ description: 'Error retrieving users' })
            }
            const users = await User.find({ 'role': userRole })
            res.status(200).send(users.map(user => {
                return {
                    id: user._id,
                    name: user.name,
                    surname: user.surname,
                    email: user.email
                }
            }))
        } catch (e) {
            res.status(400).send({ description: 'Error retrieving users' })
        }
    }
}

exports.get_user = async (req, res) => {
    const { name, email } = req.user
    res.status(200).send({ name, email })
}

exports.get_user_orders = async (req, res) => {
    try {
        const user = req.user
        const userOrders = await Order.find({ userId: user._id })
        res.status(200).send(userOrders)
    } catch (error) {
        res.status(400).send({ description: error.message })
    }
}


exports.add_product_to_cart = async (req, res) => {
    try {
        const user = req.user
        const { productId, quantity } = req.body
        // controllare se prodotto esiste
        const product = await Product.findById(productId)
        if (product) {
            await user.addProductToCart(product, quantity)
            res.status(200).send({ desription: `product added` })
        } else {
            res.status(404).send({ description: 'Product not found' })
        }
    } catch (e) {
        console.log(e)
        res.status(400).send({ description: 'Error adding product to cart' })
    }
}
// TODO da sistemare con query fatte bene
exports.delete_product_from_cart = async (req, res) => {
    try {
        const user = req.user
        const productId = req.params.productId
        user.cart = user.cart.filter(product => {
            return product.productId != productId
        })
        await user.save()
        res.status(200).send({ description: 'product removed from cart' })
    } catch (error) {
        res.status(400).send({ description: 'Error deleting cart product' })
    }
}

// TODO da sistemare con query fatte bene
exports.update_cart_product = async (req, res) => {
    try {
        const user = req.user
        const productId = req.params.productId
        const { quantity } = req.body
        user.cart = user.cart.map(product => {
            if (product.productId != productId) {
                return product
            } else {
                product.quantity = quantity
                return product
            }
        })
        await user.save()
        res.status(200).send({ description: 'cart product updated' })
    } catch (error) {
        res.status(400).send({ description: 'Error deleting cart product' })
    }
}


exports.get_user_cart = async (req, res) => {
    try {
        const user = req.user
        const cartProducts = user.cart.map(cartProduct => {
            return {
                id: cartProduct.productId,
                quantity: cartProduct.quantity,
                image: cartProduct.image,
                name: cartProduct.name,
                price: cartProduct.price
            }
        })

        const total = 0
        cartProducts.array.forEach(product => {
            total += product.price * product.quantity
        });

        res.status(200).send(
            {
                total,
                cartProducts
            })

    } catch (e) {
        console.log(e)
        res.status(400).send({ description: 'Error retrieving user cart' })
    }
}







