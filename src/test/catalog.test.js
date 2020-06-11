const dbHandler = require('./db-handler')
const Category = require('../models/categoryModel');
const Product = require('../models/productModel');

const category1 = {
    name: "Category1",
    image: 'image/path/1'
}
const category2 = {
    name: "Category2"
}

const product1 = {
    name: "Product1",
    description: "Product 1 description",
    price: 25,
    ingredients: ["Acqua", "Farina", "Sale", "Pepe"]
}


const product2 = {
    name: "Product2",
    image: "image/path/2"
}


beforeAll(async () => await dbHandler.connect());

afterEach(async () => {
    //await dbHandler.clearDatabase()
});

afterAll(async () => {
    await dbHandler.clearDatabase()
    await dbHandler.closeDatabase()
});

describe('Category & Product Model Test', () => {
    it('Create category', async () => {
        const cat1 = new Category(category1)
        const savedCat1 = await cat1.save()
        expect(savedCat1._id).toBeDefined()
        expect(savedCat1.name).toBe(category1.name)
        expect(savedCat1.image).toBeDefined

        const cat2 = new Category(category2)
        const savedCat2 = await cat2.save()
        expect(savedCat2._id).toBeDefined()
        expect(savedCat2.name).toBe(category2.name)
        expect(savedCat2.image).not.toBeDefined()

        const count = await Category.count({})
        expect(count).toBe(2);
    })

    it('Create product', async () => {
        const cat1 = await Category.findOne({name: category1.name})
        product1.categoryId = cat1._id
        product1.categoryName = cat1.name
        product2.categoryId = cat1._id
        product2.categoryName = cat1.name
        const prod1 = new Product(product1)
        const savedProd1 = await prod1.save();
        expect(savedProd1._id).toBeDefined()
        expect(savedProd1.categoryId).toBe(cat1._id)
        expect(savedProd1.categoryName).toBe(cat1.name)
        expect(savedProd1.name).toBe(product1.name)
        expect(savedProd1.description).toBe(product1.description)
        expect(savedProd1.price).toBe(product1.price)
        expect(savedProd1.ingredients).toHaveLength(4)

        const prod2 = new Product(product2)
        const savedProd2 = await prod2.save()
        expect(savedProd2._id).toBeDefined()
        expect(savedProd2.categoryId).toBe(cat1._id)
        expect(savedProd2.categoryName).toBe(cat1.name)
        expect(savedProd2.name).toBe(product2.name)
        expect(savedProd2.description).not.toBeDefined()
        expect(savedProd2.image).toBe(product2.image)
        expect(savedProd2.ingredients).toHaveLength(0)

        const count = await Product.count({})
        expect(count).toBe(2);
    })

    
    it('Update product', async () => {
        const prod1 = await Product.findOne({name: product1.name})
        expect(prod1).toBeTruthy()
        
        prod1.price = 30
        prod1.image = "image/path/1"
        
        prod1.ingredients = prod1.ingredients.filter(ingredient => ingredient !== "Sale");
        const updatedProd = await prod1.save()

        expect(updatedProd.image).toBeDefined();
        expect(updatedProd.price).toBe(30);
        expect(updatedProd.ingredients).toHaveLength(3)
    })
})
