const Category = require("../models/categoryModel");
const Product = require("../models/productModel");

const mapToResponseCategory = category => {
    return {
        id: category._id,
        name: category.name,
        image: category.image
    }
}

exports.get_categories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(201).send(categories.map(category => mapToResponseCategory(category)));
    } catch (error) {
        console.log(error.message);
        res.status(400).send({ description: error.message });
    }
};

exports.create_category = async (req, res) => {
    try {
        const { name, image } = req.body;
        console.log(req.body);

        if (name == null) {
            res.status(401).send({ description: "Wrong parameters" });
            return
        }

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            res.status(400).send({ description: "Category already present" });
            return
        }

        const category = new Category({
            name,
            image
        })

        await category.save();

        res.status(201).send(mapToResponseCategory(category));
    } catch (error) {
        console.log(error.message);
        res.status(400).send({ description: error.message });
    }
};

exports.update_category = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const { name, image } = req.body;

        const existentCategory = await Category.findOne({ _id: categoryId });
        if (existentCategory) {
            await Category.updateOne({ _id: categoryId }, { name: name, image: image });
            // updates related products
            await Product.updateMany({ categoryId: categoryId }, {
                $set: {
                    categoryName: name
                }
            })

            res.status(201).send({
                ...mapToResponseCategory(existentCategory),
                name: name,
                image: image
            });
        } else {
            res.status(400).send({ description: "Category doesn't exist" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(400).send({ description: error.message });
    }
};

exports.delete_category = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;

        const existentCategory = await Category.findOne({ _id: categoryId })

        if (existentCategory) {
            const categoryProductCount = await Product.count({ categoryId: categoryId })
            if (categoryProductCount > 0) {
                res.status(400).send({ description: 'Cannot delete category with products, first delete all those' })
                return
            }
            await Category.deleteOne(existentCategory);
            res.status(201).send({ message: "Category successfully deleted" });
        } else {
            res.status(400).send({ description: "Category doesn't exist" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ description: error.message });
    }
};
