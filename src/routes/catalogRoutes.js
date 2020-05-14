module.exports = (app) => {
    const categoryController = require('../controllers/categoryController.js')
    const productController = require('../controllers/productController')

    app.route('/catalog/category')
        .get(categoryController.get_categories)
        .post(categoryController.create_category)
        .put(categoryController.update_category)
        .delete(categoryController.delete_category)

    app.route('/catalog/product')
        .get(productController.get_product)
        .post(productController.create_product)
        .put(productController.update_product)
        .delete(productController.delete_product)
}