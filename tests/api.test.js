const Blog = require("../models/blog");
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const { initialBlogs } = require("./api.test-helper");

const api = request(app);

describe('fetches data', () => {
    test('status and content type', async () => {
        await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('body length', async () => {
        const response = await api.get('/api/blogs');
        expect(response.body).toHaveLength(initialBlogs.length);
    });

});

describe('adds data', () => {
    test('add data', async () => {
        let response = await api.post('/api/blogs')
            .send({
                "title": "SDASD",
                "author": "this guy",
                "url": "/asdasd/asdasd",
                "likes": 2
            })

    });
});

beforeEach(async () => {
    await Blog.deleteMany({});

    let blogObject = new Blog(initialBlogs);
    await blogObject.save();
})

afterAll(() => {
    mongoose.connection.close();
})