const BlogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}


BlogRouter.get('/', async (request, response) => {
    let blogs = await Blog.find({}).populate('user', { username: true, name: true });
    try {
        response.json(blogs.map(blog => blog.toJSON()));
    } catch (error) {
        response.status(404).end();
    }
})

BlogRouter.post('/', async (request, response) => {
    const body = request.body;
    const token = getTokenFrom(request)

    const decodedToken = jwt.decode(token, process.env.SECRET);

    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })

    if (!blog.likes) {
        blog.likes = 0;
    }
    if (!blog.title && !blog.url) {
        response.status(400).end();
        return;
    }
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save();
    response.status(201).json(blog);
})

BlogRouter.delete('/:id', async (request, response) => {
    const id = request.params.id;
    try {
        await Blog.findByIdAndRemove(id);
        response.status(204).end();
    } catch (error) {
        response.status(404).end();
    }
})

BlogRouter.put('/:id', async (request, response) => {
    const id = request.params.id;
    const record = request.body;

    const newRecord = {
        title: record.title,
        author: record.author,
        url: record.url,
        likes: record.likes
    }

    try {
        const updatedRecord = await Blog.findByIdAndUpdate(id, newRecord, { new: true });
        response.json(updatedRecord);
    } catch (error) {
        response.status(404).end();
    }
})

module.exports = BlogRouter;