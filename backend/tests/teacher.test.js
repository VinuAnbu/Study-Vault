const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); 
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Resource = require('../models/Resource');


/* FOR THIS TEST SUITE WE WILL NEED 
 * 1. Users - teacher@gmail.com & newjohn@gmail.com
 * 2. Subject - Maths
*/

let resourceID = '';
/* ID of the subject to add the resource to. Subject: Maths */
const subjectId = new mongoose.Types.ObjectId('680fd7dda266e59e8eec81d4');
/* Creating the student (newjohn@gmail.com) JWT token */
const user = { id: new mongoose.Types.ObjectId('680fd45ba266e59e8eec8115'), role: "student" }; // user._id of the already existing teacher
const userToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
/* Creating the teacher (teacher@gmail.com) JWT token */
const teacher = { id: new mongoose.Types.ObjectId('680fd6caa266e59e8eec81a6'), role: "teacher" }; // user._id of the already existing teacher
const teacherToken = jwt.sign(teacher, process.env.JWT_SECRET, { expiresIn: '1h' });

/* Creates a subject with random name */
var randomString = Math.random().toString(36).substring(2, 8); // 6 characters
randomString = "TEST CASE - " + randomString;

describe('POST /api/subjects/createsubject', () => {
    /* 1st Test case: Creates a new subject */
    it('Creates a new subject', async () => {
        const res = await request(app)
            .post('/api/subjects/createsubject')
            .set('Authorization', `Bearer ${teacherToken}`) 
            .send({ name: randomString});

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Subject created');
    });

    /* 2nd Test case: Creates new resource with a share request for the student */
    it('Creates a new resource with request to share option', async () => {

        const res = await request(app)
            .post('/api/resources/upload')
            .set('Authorization', `Bearer ${userToken}`) 
            .field('title', 'Test case resource')
            .field('comment', 'Test comment')
            .field('subject', subjectId.toString())
            .field('shareRequest', true)
            .field('createQuiz', false)
            .attach('file', Buffer.from('%PDF-1.4\n% Dummy content'), 'dummy.pdf'); /* attaching a dummy pdf file */

        resourceID = res.body.resource._id;
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('A request for approval has been sent!');
    });


    /* 3rd Test case: Accept student resource request */    
    it('Integration Test: Approve a resource', async () => {
        const resourceID = '6813ba87c26763f8befe1058';
        const resourceAuthorID = '680fd45ba266e59e8eec8115';
    
        // Get author's XP before approval
        const authorBefore = await User.findById(resourceAuthorID);
        const xpBefore = authorBefore.xp;
    
        // Send approval request
        const res = await request(app)
            .post(`/api/teacher/approve/${resourceID}`)
            .set('Authorization', `Bearer ${teacherToken}`);
    
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Resource Approved');
    
        // Verify XP was increased by 5
        const authorAfter = await User.findById(resourceAuthorID);
        expect(authorAfter.xp).toBe(xpBefore + 5);
    
        // Check for notification
        const notification = await Notification.findOne({ user: resourceAuthorID }).sort({ createdAt: -1 });
        expect(notification).toBeTruthy();
        expect(notification.message).toContain('Your resource');
        expect(notification.message).toContain('approved');
        expect(notification.message).toContain('5 XP');
    });


    // Clean up after tests
    afterAll(async () => {
        await mongoose.connection.close();  // Close the MongoDB connection
    });
});
