const Category = require("../models/categoryModel");

exports.get_product = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Category.findProductById(productId)
        if (product) {
            res.status(201).send({
                    id: product.id,
                    name: product.name,
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

        const existentCategory = await Category.findOne({ _id: category_id });
        if (existentCategory) {
            existentCategory.products.push({
                name,
                description,
                image,
                price,
                ingredients,
            });

            await existentCategory.save();
            let asd = existentCategory.products[existentCategory.products.length - 1]._id

            res.status(201).send({ message: `Product successfully added. Id: ${asd}` });
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

        const categories = await Category.find();
        categories.forEach(async (category) => {
            category.products.forEach(async (product) => {
                console.log(product.name);
                if (product._id == productId) {
                    let categoryId = category._id;

                    let prod_name = name != null ? name : product.name;
                    let prod_description =
                        description != null ? description : product.description;
                    let prod_image = image != null ? image : product.image;
                    let prod_price = price != null ? price : product.price;

                    let prod_ingredients =
                        ingredients != null ? ingredients : product.ingredients;

                    await Category.updateOne(
                        { _id: categoryId, "products._id": productId },
                        {
                            "products.$.name": prod_name,
                            "products.$.description": prod_description,
                            "products.$.image": prod_image,
                            "products.$.price": prod_price,
                            "products.$.ingredients": prod_ingredients,
                        }
                    );

                    res.status(201).send({ message: "Product updated" });
                    return;
                }
            });
        });
    } catch (error) {
        res.status(404).send({ description: error.message });
        console.log(error.message);
    }
};

exports.delete_product = async (req, res) => {
    try {
        const productId = req.params.productId;

        const categories = await Category.find()
        categories.forEach(async (category) => {
            category.products.forEach(async (product) => {
                console.log(product.name);
                if (product._id === productId) {
                    category.products.id(productId).remove()
                    category.save()

                    res.status(201).send({ message: "Product deleted" })
                    return
                }
            })
        })
    } catch (error) {
        res.status(404).send({ description: error.message });
        console.log(error.message);
    }
};

exports.get_products = async (req, res) => {
    try {
        const categoryId = req.query.categoryId
        if (categoryId) {
            const existentCategory = await Category.findOne({ _id: categoryId });
            if (existentCategory) {
                const products = existentCategory.products;
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
            // TODO: get all products
        }

    } catch (error) {
        res.status(404).send({ description: error.message });
        console.log(error.message);
    }
}
