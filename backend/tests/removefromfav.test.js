const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/* FOR THIS TEST SUITE WE WILL NEED 
 * 1. User - newjohn@gmail.com (ID: 680fd45ba266e59e8eec8115)
 * 2. Resource ID - 6813ba87c26763f8befe1058
*/

describe('POST /removefromfav', () => {
    const userId = '680fd45ba266e59e8eec8115';  
    const resourceId = '6813ba87c26763f8befe1058';

    // Ensure the resource is liked before removal test
    beforeAll(async () => {
        await request(app)
            .post('/api/auth/addtofav')
            .send({
                userid: userId,
                RId: resourceId // Adds if not already present
            });
    });

    it('Remove the resource from favourites', async () => {
        // Sending a request to remove the resource from favourites
        const res = await request(app)
            .post('/api/auth/removefromfav')
            .send({
                userid: userId,
                RId: resourceId
            });

        // Check that the status is 200 and the correct message is returned
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Resources removed successfully ");

        // Verify that the resource is no longer in the user's favourites
        const user = await User.findById(userId);
        expect(user.liked).not.toContain(resourceId); // Check that resourceId is not in the liked array
    });

    
    afterAll(async () => {
        await mongoose.connection.close();  // Close the MongoDB connection
    });

});
