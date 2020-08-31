const Blog = require("../models/blog");
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const { initialBlogs, newBlog, noLikeBlog, noTitleNoUrlBlog, dbItems } = require("./api.test-helper");

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

    test('id exists', async () => {
        const response = await api.get('/api/blogs');
        expect(response.body[0].id).toBeDefined();
    })
});

describe('adds data', () => {
    test('add data', async () => {
        await api.post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const allItems = await dbItems();
        const titles = allItems.map(item => item.title);

        expect(titles).toContain(newBlog.title);
        expect(allItems).toHaveLength(initialBlogs.length + 1);

    });
});

describe('likes', () => {
    test('default to zero', async () => {
        await api.post('/api/blogs')
            .send(noLikeBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const allItems = await dbItems();
        const lastElement = allItems[allItems.length - 1];

        expect(lastElement.likes).toBe(0);
    })
})

describe('Missing properties', () => {
    test('missing title and url', async () => {
        await api.post('/api/blogs')
            .send(noTitleNoUrlBlog)
            .expect(400);
    })
})

beforeEach(async () => {
    await Blog.deleteMany({});

    let blogObject = new Blog(initialBlogs[0]);
    await blogObject.save();
})

afterAll(() => {
    mongoose.connection.close();
})