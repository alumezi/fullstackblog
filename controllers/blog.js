const BlogRouter = require('express').Router();
const Blog = require('../models/blog');

BlogRouter.get('/', async (request, response) => {
    let blogs = await Blog.find({});
    try {
        response.json(blogs);
    } catch (error) {
        response.status(404).end();
    }
})

BlogRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body);
    if (!blog.likes) {
        blog.likes = 0;
    }
    if (!blog.title && !blog.url) {
        response.status(400).end();
        return;
    }
    await blog.save();
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