module.exports = (app) => {
    const categoryController = require('../controllers/categoryController')
    const productController = require('../controllers/productController')

    app.route('/catalog/categories')
        .get(categoryController.get_categories)
        .post(categoryController.create_category)
        .put(categoryController.update_category)
        .delete(categoryController.delete_category)

    app.route('/catalog/products')
        .get(productController.get_category_products)
        .post(productController.add_product)
        .put(productController.update_product)
        .delete(productController.delete_product)
}