const request = require('supertest');
const { app, server, mongoose } = require('../server');
const User = require('../models/User');

beforeEach(async () => {
    await User.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
    server.close();
});

describe('Auth Endpoints', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');

        const user = await User.findOne({ email: 'test@example.com' });
        expect(user).not.toBeNull();
    });

    it('should login an existing user', async () => {
        // First, register a user
        await User.create({
            name: 'Test User 2',
            email: 'test2@example.com',
            password: 'password123',
        });

        // Then, try to login
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'test2@example.com',
                password: 'password123',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should fail to login with wrong password', async () => {
        await User.create({
            name: 'Test User 3',
            email: 'test3@example.com',
            password: 'password123',
        });

        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'test3@example.com',
                password: 'wrongpassword',
            });
        expect(res.statusCode).toEqual(401);
    });
});