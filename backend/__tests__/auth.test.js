const request = require('supertest');
const { app, server } = require('../server');
const User = require('../models/User');

beforeEach(async () => {
    await User.deleteMany({});
});

afterAll(() => {
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
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');

        const user = await User.findOne({ email: 'test@example.com' });
        expect(user).not.toBeNull();
    });

    it('should login an existing user', async () => {
        // First, register a user
        await request(app)
            .post('/api/v1/auth/register')
            .send({
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
        await request(app)
            .post('/api/v1/auth/register')
            .send({
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

    it('should get current user with /me endpoint', async () => {
        const registerRes = await request(app)
            .post('/api/v1/auth/register')
            .send({
                name: 'Test User 4',
                email: 'test4@example.com',
                password: 'password123',
            });

        const token = registerRes.body.token;

        const res = await request(app)
            .get('/api/v1/auth/me')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('_id');
        expect(res.body.data.name).toBe('Test User 4');
        expect(res.body.data.email).toBe('test4@example.com');
    });
});