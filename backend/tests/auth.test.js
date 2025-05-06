const request = require('supertest');
const app = require('../server'); 
const mongoose = require('mongoose');

/* FOR THIS TEST SUITE WE WILL NEED 
 * 1. Student - newjohn@gmail.com
*/

describe('POST /api/auth/login', () => {
  jest.setTimeout(10000);  // Increase the timeout to 10 seconds

  
  /* USER Autentication Test cases */
  it('Test login with correct credentials', async () => {
    const email = 'newjohn@gmail.com';  
    const password = 'john1';  
    
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email, password });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('login success');
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(email);
  });

  it('Test login with incorrect credentials', async () => {
    const email = 'wrong@example.com';  // Non-existent email
    const password = 'WrongPassword';  // Incorrect password

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email, password });

    expect(res.status).toBe(200);  // Assuming you want to check for a 200 status
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Invalid credentials');
  });

  // Clean up after tests
  afterAll(async () => {
    await mongoose.connection.close();  // Close the MongoDB connection
  });
});
