const dbHandler = require('./db-handler')
const Product = require('../models/categoryModel');


beforeAll(async () => await dbHandler.connect());

afterEach(async () => {
    //await dbHandler.clearDatabase()
});

afterAll(async () => {
    await dbHandler.clearDatabase()
    await dbHandler.closeDatabase()
});

describe('Category Model Test', () => {

    it('What this test do', async () => {

    })
})
