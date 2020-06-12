const adminAuth = require('../middlewares/adminAuthMiddleware')

module.exports = (app) => {
    const categoryController = require("../controllers/categoryController");
    const productController = require("../controllers/productController");

    app
        .route("/catalog/categories")
        .get(categoryController.get_categories)
        .post(adminAuth, categoryController.create_category);

    app
        .route("/catalog/categories/:categoryId")
        .put(adminAuth, categoryController.update_category)
        .delete(adminAuth, categoryController.delete_category);

    app
        .route("/catalog/products")
        .post(adminAuth, productController.add_product_to_category)
        .get(productController.get_products);

    app
        .route("/catalog/products/:productId")
        .get(productController.get_product);

    app
        .route("/catalog/products/:productId")
        .put(adminAuth, productController.update_product)
        .delete(adminAuth, productController.delete_product);
};
