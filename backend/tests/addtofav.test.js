const request = require('supertest');
const app = require('../server'); 
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

/* FOR THIS TEST SUITE WE WILL NEED 
 * 1. User - newjohn@gmail.com (ID: 680fd45ba266e59e8eec8115)
 * 2. Resource ID - 6813ba87c26763f8befe1058
*/

describe('POST /addtofav', () => {
    jest.setTimeout(10000);  // Increase the timeout to 10 seconds

    const userId = '680fd45ba266e59e8eec8115';  
    const resourceId = '6813ba87c26763f8befe1058';

    // Ensure the resource is liked before removal test
    beforeAll(async () => {
        await request(app)
            .post('/api/auth/addtofav')
            .send({
                userid: userId,
                RId: resourceId // This will add if not already present
            });
    });   


    it('Add resource to favourites', async () => {
        const res = await request(app)
            .post('/api/auth/addtofav')
            .send({
                userid: userId,
                RId: resourceId
            });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Resource liked successfully");
        
    });

    afterAll(async () => {
    await mongoose.connection.close();  // Close the MongoDB connection
    });

    //it('Should add the resource to liked if it was not already liked', async () => {
        //const res = await request(app)
            //.post('/removefromfav')
            //.send({
                //userid: userId,
                //RId: resourceId
            //});

        //expect(res.status).toBe(200);
        //expect(res.body.message).toBe("Resources added to fav successfully ");
    //});

    afterAll(async () => {
        await mongoose.connection.close();  // Close the MongoDB connection
    });
});
