const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const User = require('../models/userModel')

exports.get_product = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId)
        if (product) {
            res.status(201).send(mapToResponseProduct(product));
        } else {
            res.status(404).send({ description: "Product not found" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).send({ description: "Error retrieving product" });
    }
};

const mapToResponseProduct = (product) => {
    return {
        id: product.id,
        name: product.name,
        categoryId: product.categoryId,
        categoryName: product.categoryName,
        description: product.description,
        image: product.image,
        price: product.price,
        ingredients: product.ingredients
    }
}
exports.add_product_to_category = async (req, res) => {
    try {
        const {
            category_id,
            name,
            description,
            image,
            price,
            ingredients,
        } = req.body;

        console.log(category_id)
        const existentCategory = await Category.findById(category_id);
        if (existentCategory) {
            const product = new Product({
                name,
                description,
                image,
                price,
                ingredients,
                categoryId: category_id,
                categoryName: existentCategory.name
            })
            await product.save();
            res.status(201).send(mapToResponseProduct(product));
        } else {
            res.status(404).send({ message: "Category doens't exist" });
        }
    } catch (error) {
        res.status(404).send({ description: error.message });
        console.log(error.message);
    }
};

exports.update_product = async (req, res) => {
    try {
        const { name, description, image, price, ingredients } = req.body;

        const productId = req.params.productId;
        const product = await Product.findById(productId)
        if (!product) {
            res.status(404).send({ description: "Product not found" });
        }

        const prod_name = name ? name : product.name;
        const prod_description = description ? description : product.description;
        const prod_image = image ? image : product.image;
        const prod_price = price ? price : product.price;
        const prod_ingredients = ingredients ? ingredients : product.ingredients;

        await Product.updateOne(
            { _id: productId },
            {
                name: prod_name,
                description: prod_description,
                image: prod_image,
                price: prod_price,
                ingredients: prod_ingredients,
            }
        );

        await User.updateMany({ 'cart.productId': productId }, {
            $set: {
                'cart.$.image': prod_image,
                'cart.$.name': prod_name,
                'cart.$.price': prod_price
            }
        })

        res.status(201).send({
            ...mapToResponseProduct(product),
            name: prod_name,
            description: prod_description,
            image: prod_image,
            price: prod_price,
            ingredients: prod_ingredients
        });

    } catch (error) {
        res.status(404).send({ description: error.message });
        console.log(error.message);
    }
};

exports.delete_product = async (req, res) => {
    try {

        const productId = req.params.productId;

        const product = await Product.findById(productId)

        if (product) {
            await product.remove()

            //remove user cart product
            await User.update(
                {},
                { $pull: { cart: { productId: productId } } },
                { multi: true })

            res.status(201).send({ description: "Product deleted" })
            return
        }
        {
            res.status(404).send({ description: "product not found" });
            return
        }

    } catch (error) {
        console.log(error.message);
        res.status(404).send({ description: error.message });
    }
};

exports.get_products = async (req, res) => {
    try {
        const categoryId = req.query.categoryId
        if (categoryId) {
            const products = await Product.find({ categoryId: categoryId })
            if (products) {
                res.status(201).send(products.map(product => mapToResponseProduct(product)));
            } else {
                res.status(404).send({ message: "Category doens't exist" });
            }
        } else {
            res.status(201).send(await Product.find({}));
        }

    } catch (error) {
        res.status(404).send({ description: error.message });
        console.log(error.message);
    }
}
