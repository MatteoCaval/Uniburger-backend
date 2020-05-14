const Category = require("../models/categoryModel");

exports.get_categories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(201).send(categories);
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
      res.status(401).send({ message: "Wrong parameters" });
    }

    const existentCategory = await Category.findOne({ name });
    if (existentCategory) {
      res.status(400).send({ description: "Category already present" });
    }

    const category = new Category({
      name,
      image,
    });

    await category.save();

    res.status(201).send({ message: "Category successfully created" });
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ description: error.message });
  }
};

exports.update_category = async (req, res) => {
  try {
    const { name, new_name, image } = req.body;
    console.log(req.body);

    const existentCategory = await Category.findOne({ name });
    if (existentCategory) {
      await Category.updateOne({ name }, { name: new_name, image: image });

      res.status(201).send({ message: "Category successfully updated" });
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
    const name = req.body.name;
    console.log(req.body);

    const existentCategory = await Category.findOne({ name });

    if (existentCategory) {
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
