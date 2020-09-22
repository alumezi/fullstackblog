const Blog = require("../models/blog");
const User = require("../models/user");
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const { initialUsers, initialBlogs, newBlog, noLikeBlog, noTitleNoUrlBlog, dbItems, dbUsers } = require("./api.test-helper");

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

describe('deletes data', () => {
    test('delete record', async () => {
        const records = await dbItems();
        const recordToDelete = records[0];

        await api.delete(`/api/blogs/${recordToDelete.id}`)
            .expect(204)

        const recordsAfter = await dbItems();
        expect(recordsAfter).toHaveLength(initialBlogs.length - 1);

        const contents = recordsAfter.map(item => item.id);
        expect(contents).not.toContain(recordToDelete.id);
    })
})

describe('update data', () => {
    test('update likes', async () => {
        const records = await dbItems();
        const recordToUpdate = records[0];

        await api.put(`/api/blogs/${recordToUpdate.id}`)
            .send({ ...recordToUpdate, likes: 100 })
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const modifiedRecords = await dbItems();
        const modifiedRecord = modifiedRecords[0];
        expect(modifiedRecords).toHaveLength(initialBlogs.length);
        expect(modifiedRecord.likes).toBe(100)
    })
})

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

describe('user operations', () => {
    test('signup', async () => {
        const usersBefore = await dbUsers();

        const newUser = {
            "name": "test",
            "username": "test123",
            "password": "123werffsd4wr"
        }

        const response = await api.post('/api/users')
            .send(newUser)
            .expect(200)

        expect(response.body.username).toEqual('test123')

        const usersAfter = await dbUsers();
        expect(usersAfter).toHaveLength(usersBefore.length + 1)

        const content = usersAfter.map(item => item.username)
        expect(content).toContain('test123')
    })

    test('signup -> username not given', async () => {
        const usersBefore = await dbUsers();

        const newUser = {
            "name": "test",
            "username": "",
            "password": "123werffsd4wr"
        }

        await api.post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAfter = await dbUsers();
        expect(usersAfter).toHaveLength(usersBefore.length)
    })

    test('signup -> password not given', async () => {
        const usersBefore = await dbUsers();

        const newUser = {
            "name": "test",
            "username": "1afdafw4sdvdr",
            "password": ""
        }

        await api.post('/api/users')
            .send(newUser)
            .expect(401)

        const usersAfter = await dbUsers();
        expect(usersAfter).toHaveLength(usersBefore.length)
    })

    test('signup -> username shorter than 3 characters', async () => {
        const usersBefore = await dbUsers();

        const newUser = {
            "name": "test",
            "username": "1a",
            "password": "asdr32rsfd23rsdf**"
        }

        await api.post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAfter = await dbUsers();
        expect(usersAfter).toHaveLength(usersBefore.length)
    })

    test('signup -> password shorter than 3 characters', async () => {
        const usersBefore = await dbUsers();

        const newUser = {
            "name": "test",
            "username": "asdasd1a",
            "password": "as"
        }

        await api.post('/api/users')
            .send(newUser)
            .expect(401)

        const usersAfter = await dbUsers();
        expect(usersAfter).toHaveLength(usersBefore.length)
    })
})

beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    let blogObject = new Blog(initialBlogs[0]);
    await blogObject.save();

    let user = new User(initialUsers[0]);
    await user.save();
})

afterAll(() => {
    mongoose.connection.close();
})