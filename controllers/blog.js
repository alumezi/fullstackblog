const BlogRouter = require('express').Router();
const Blog = require('../models/blog');
const logger = require('../utils/logger');

BlogRouter.get('/', async (request, response) => {
    let blogs = await Blog.find({});
    try {
        response.json(blogs);
    } catch (error) {
        logger.error(error);
    }
})

BlogRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body);
    try {
        await blog.save();
        response.status(201).json(blog);
    } catch (error) {
        logger.error(error);
    }
})

module.exports = BlogRouter