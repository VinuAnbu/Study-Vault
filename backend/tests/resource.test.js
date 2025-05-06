const request = require('supertest');
const app = require('../server'); 
const mongoose = require('mongoose');

/* FOR THIS TEST SUITE WE WILL NEED 
 * 1. Student - newjohn@gmail.com
*/

describe('POST /api/resources/myresources', () => {

    /* Retrieves the first resource of the student */
    it('Retrieve the first resource of the student', async () => {
        const studentId = {userid: new mongoose.Types.ObjectId('680fd45ba266e59e8eec8115')}    /* User-id of user newjohn@gmail.com */

        const res = await request(app)
            .post('/api/resources/myresources')
            .send(studentId);

        if (res.body.length > 0) {
            // There are resources
            const firstResource = res.body[0];
            
            expect(firstResource).toHaveProperty('_id');
            expect(firstResource).toHaveProperty('title');
        } else {
            expect(res.body.length).toBe(0); // check that it's an empty array
        }
    });

    // Clean up after tests
    afterAll(async () => {
        await mongoose.connection.close();  // Close the MongoDB connection
    });
});
