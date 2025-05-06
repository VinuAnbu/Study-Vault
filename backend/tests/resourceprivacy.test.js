const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const Resource = require('../models/Resource');

describe('Integration Test: Toggle Privacy  of resource.', () => {
  jest.setTimeout(10000);

  const RID = '6813ba87c26763f8befe1058';
  let subjectId, token;

  beforeAll(async () => {
    // Get the author of the resource
    const resource = await Resource.findById(RID).populate('author');
    subjectId = resource.subject.toString();

    // Generate token for the resource's author (or any valid user)
    token = jwt.sign({ id: resource.author._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
  });

  it('Integration Test: Toggle the privacy of resource to private', async () => {
    const toggleRes = await request(app)
      .post('/api/resources/togglePrivacy')
      .send({ RID, isPrivate: true });

    expect(toggleRes.statusCode).toBe(200);
    expect(toggleRes.body.private).toBe(true);

    const subjectRes = await request(app)
      .get(`/api/resources/subject/${subjectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(subjectRes.statusCode).toBe(200);

    const found = subjectRes.body.find(r => r._id === RID);
    expect(found).toBeUndefined();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
