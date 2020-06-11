const dbHandler = require('./db-handler')
const Category = require('../models/categoryModel');
const Product = require('../models/productModel');


beforeAll(async () => await dbHandler.connect());

afterEach(async () => {
    //await dbHandler.clearDatabase()
});

afterAll(async () => {
    await dbHandler.clearDatabase()
    await dbHandler.closeDatabase()
});

describe('Category & Product Model Test', () => {

    it('What this test do', async () => {

    })
})
