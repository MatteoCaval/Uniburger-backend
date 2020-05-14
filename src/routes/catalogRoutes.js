module.exports = (app) => {
  const categoryController = require("../controllers/categoryController");
  const productController = require("../controllers/productController");

  app
    .route("/catalog/categories")
    .get(categoryController.get_categories)
    .post(categoryController.create_category);

  app
    .route("/catalog/categories/:categoryId")
    .put(categoryController.update_category)
    .delete(categoryController.delete_category);

  app
    .route("/catalog/products")
    .post(productController.add_product_to_category);

  app
    .route("/catalog/products/:categoryId")
    .get(productController.get_category_products);

  app
    .route("/catalog/products/:productId")
    .put(productController.update_product)
    .delete(productController.delete_product);
};
