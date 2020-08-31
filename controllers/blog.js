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

module.exports = BlogRouter;