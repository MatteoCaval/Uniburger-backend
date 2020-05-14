const Category = require("../models/categoryModel");

exports.get_category_products = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;

        const existentCategory = await Category.findOne({ _id: categoryId });
        if (existentCategory) {
            const products = existentCategory.products;
            res.status(201).send(products);
        } else {
            res.status(404).send({ message: "Category doens't exist" });
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

        const existentCategory = await Category.findOne({_id: category_id});
        if (existentCategory) {
            existentCategory.products.push({
                name,
                description,
                image,
                price,
                ingredients
            });

            await existentCategory.save();

            res.status(201).send({ message: "Product added" });
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

        await (await Category.find({})).forEach((x) => {
            const prod = x.findOne({"products._id": productId})
            console.log(x)
        })


        res.status(201).send({ message: "Product updated" });


        /*

        if (existingCategory) {
            console.log(category_name);
            console.log(product_name);

            let product = await Category.findOne({
                name: category_name,
                "products._id": productId,
            });
            console.log(product);
            if (await Category.findOne({name: category_name,"products._id": productId,})) {
                // TODO: in questo modo sovrascrive TUTTI i campi se non li passo
                await Category.updateOne(
                    { name: category_name, "products._id": productId },
                    {
                        "products.$.name": name,
                        "products.$.description": description,
                        "products.$.image": image,
                        "products.$.price": price,
                        "products.$.ingredients": ingredients,
                    }
                );

                res.status(201).send({ message: "Product updated" });
            } else {
                res.status(404).send({ message: "Product doens't exist" });
            }
        } else {
            res.status(404).send({ message: "Category doens't exist" });
        }*/
    } catch (error) {
        res.status(404).send({ description: error.message });
        console.log(error.message);
    }
};

exports.delete_product = async (req, res) => {
    try {
        const { category_name, product_name } = req.body;

        const existingCategory = await Category.findOne({
            name: category_name,
        });
        if (existingCategory) {
            console.log(category_name);
            console.log(product_name);

            if (
                await Category.findOne({
                    name: category_name,
                    "products.name": product_name,
                })
            ) {
                // TODO: in questo modo sovrascrive TUTTI i campi se non li passo
                existingCategory.products = existingCategory.products.filter(
                    (x) => x.name !== product_name
                );

                await existingCategory.save();

                res.status(201).send({ message: "Product deleted" });
            } else {
                res.status(404).send({ message: "Product doens't exist" });
            }
        } else {
            res.status(404).send({ message: "Category doens't exist" });
        }
    } catch (error) {
        res.status(404).send({ description: error.message });
        console.log(error.message);
    }
};
