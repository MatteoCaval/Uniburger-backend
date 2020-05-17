const Product = require("../models/productModel");
const Category = require("../models/categoryModel");

exports.get_product = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId)
        if (product) {
            res.status(201).send({
                    id: product.id,
                    name: product.name,
                    categoryId: product.categoryId,
                    categoryName: product.categoryName,
                    description: product.description,
                    image: product.image,
                    price: product.price,
                    ingredients: product.ingredients
                }
            );
        } else {
            res.status(404).send({ message: "Product not found" });
        }
    } catch (error) {
        res.status(404).send({ description: error.message });
        console.log(error.message);
    }
};

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
            res.status(201).send({ message: `Product successfully added. Id: ${product._id}` });
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

        const prod_name = name != null ? name : product.name;
        const prod_description = description != null ? description : product.description;
        const prod_image = image != null ? image : product.image;
        const prod_price = price != null ? price : product.price;
        const prod_ingredients = ingredients != null ? ingredients : product.ingredients;

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

        res.status(201).send({ message: "Product updated" });

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
            res.status(201).send({ description: "Product deleted" })
        }
        {
            res.status(404).send({ description: "product not found" });
        }

    } catch (error) {
        res.status(404).send({ description: error.message });
        console.log(error.message);
    }
};

exports.get_products = async (req, res) => {
    try {
        const categoryId = req.query.categoryId
        if (categoryId) {
            const products = await Product.find({ categoryId: categoryId })
            if (products) {
                res.status(201).send(products.map(product => {
                    return {
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        image: product.image,
                        price: product.price
                    }
                }));
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
